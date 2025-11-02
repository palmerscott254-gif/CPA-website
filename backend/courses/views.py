from rest_framework import generics, filters, permissions
from .models import Subject, Unit
from .serializers import SubjectSerializer, UnitSerializer

class SubjectListView(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [permissions.AllowAny]

class UnitListView(generics.ListAPIView):
    queryset = Unit.objects.all().order_by("order")
    serializer_class = UnitSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "code", "description", "subject__name"]
    pagination_class = None
