from rest_framework import generics, filters, permissions
from rest_framework.response import Response
from django.core.cache import cache
from .models import Subject, Unit
from .serializers import SubjectSerializer, UnitSerializer

# Cache TTL in seconds (5 minutes).  Subjects change rarely; this prevents
# a cold-start DB hit on every request to the most-visited public endpoint.
_SUBJECTS_CACHE_TTL = 300
_SUBJECTS_CACHE_KEY = "subjects_list_v1"


class SubjectListView(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        # Return cached serialized data when available to avoid a DB round-trip
        cached = cache.get(_SUBJECTS_CACHE_KEY)
        if cached is not None:
            return Response(cached)
        response = super().list(request, *args, **kwargs)
        cache.set(_SUBJECTS_CACHE_KEY, response.data, _SUBJECTS_CACHE_TTL)
        return response

class UnitListView(generics.ListAPIView):
    queryset = Unit.objects.all().order_by("order")
    serializer_class = UnitSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "code", "description", "subject__name", "subject__slug"]
    pagination_class = None
