from rest_framework import generics, permissions, status, serializers
from .models import Material
from .serializers import MaterialSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse, Http404
from rest_framework.decorators import api_view, permission_classes
from django.db.models import F, Q
import os

class MaterialListView(generics.ListAPIView):
    serializer_class = MaterialSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Material.objects.filter(is_public=True).order_by("-download_count")
        unit = self.request.query_params.get("unit")
        search = self.request.query_params.get("search")
        if unit:
            qs = qs.filter(unit__id=unit)
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(description__icontains=search))
        sort = self.request.query_params.get("sort")
        if sort == "downloads":
            qs = qs.order_by("-download_count")
        return qs


class MaterialCreateView(generics.CreateAPIView):
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        user = self.request.user
        uploaded_file = self.request.FILES.get("file")
        if uploaded_file:
            ext = uploaded_file.name.split(".")[-1].lower()
            if ext != "pdf":
                raise serializers.ValidationError({"file": "Only PDF files are allowed."})
            if uploaded_file.size > 20 * 1024 * 1024:
                raise serializers.ValidationError({"file": "Max size 20MB."})
        serializer.save(uploaded_by=user)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def material_download_view(request, pk):
    material = get_object_or_404(Material, pk=pk)

    if not material.is_public and not (request.user.is_admin or material.uploaded_by == request.user):
        return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

    file_path = material.file.path
    if not os.path.exists(file_path):
        raise Http404

    Material.objects.filter(pk=material.pk).update(download_count=F("download_count") + 1)

    return FileResponse(open(file_path, "rb"), as_attachment=True, filename=os.path.basename(file_path))