from rest_framework import generics, permissions, status, serializers
from .models import Material
from .serializers import MaterialSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponseRedirect, FileResponse, Http404
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from django.db.models import F, Q
import os
import logging
import boto3
from botocore.exceptions import ClientError

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
        elif sort == "title":
            qs = qs.order_by("title")
        elif sort == "date":
            qs = qs.order_by("-upload_date")
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
            allowed_extensions = ["pdf", "doc", "docx", "ppt", "pptx", "mp4", "avi", "mov"]
            if ext not in allowed_extensions:
                raise serializers.ValidationError({"file": f"Only {', '.join(allowed_extensions)} files are allowed."})
            if uploaded_file.size > 50 * 1024 * 1024:  # 50MB limit
                raise serializers.ValidationError({"file": "Max size 50MB."})
        serializer.save(uploaded_by=user)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def material_download_view(request, pk):
    """
    Download endpoint that requires authentication.
    Returns a temporary presigned S3 URL for authenticated users.
    Returns 401 if unauthenticated, 403 if not allowed.
    """
    logger = logging.getLogger(__name__)
    material = get_object_or_404(Material, pk=pk)

    # Check permissions: public materials are accessible to all authenticated users
    # Private materials require staff/superuser or uploader permissions
    if not material.is_public:
        if not (request.user.is_staff or request.user.is_superuser or material.uploaded_by == request.user):
            logger.warning(f"User {request.user.id} attempted unauthorized access to material {material.pk}")
            return Response(
                {"detail": "You do not have permission to download this material."}, 
                status=status.HTTP_403_FORBIDDEN
            )

    # Increment download count
    Material.objects.filter(pk=material.pk).update(download_count=F("download_count") + 1)

    # Check if we're using S3 storage
    if settings.USE_S3:
        try:
            storage = getattr(material.file, 'storage', None)
            filename = os.path.basename(material.file.name)
            # Use the storage backend's URL method to generate a signed URL with correct key
            # Pass Content-Disposition so the browser downloads with a friendly filename
            signed_url = storage.url(
                material.file.name,
                parameters={
                    'ResponseContentDisposition': f'attachment; filename="{filename}"'
                },
                expire=3600
            )
            logger.info(
                f"Generated presigned URL via storage for material {material.pk} (user: {request.user.id})"
            )
            return Response({"download_url": signed_url}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error generating presigned URL via storage for material {material.pk}: {e}")
            return Response(
                {"detail": "Error generating download link. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    
    # Local file storage fallback for development
    try:
        file_handle = material.file.open('rb')
        filename = os.path.basename(material.file.name)
        response = FileResponse(file_handle, as_attachment=True, filename=filename)
        logger.info(f"Serving local file download for material {material.pk}: {filename}")
        return response
    except FileNotFoundError:
        logger.error(f"File not found for material {material.pk}: {material.file.name}")
        raise Http404("File not found.")
    except Exception as e:
        logger.error(f"Error serving file for material {material.pk}: {e}")
        return Response(
            {"detail": "Error serving file. Please try again."}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )