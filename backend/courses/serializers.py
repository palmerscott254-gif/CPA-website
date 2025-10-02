from rest_framework import serializers
from .models import Material
from courses.models import Unit
from courses.serializers import UnitSerializer

class MaterialSerializer(serializers.ModelSerializer):
    unit = UnitSerializer(read_only=True)
    unit_id = serializers.PrimaryKeyRelatedField(queryset=Unit.objects.all(), source="unit", write_only=True)

    class Meta:
        model = Material
        fields = ("id","unit","unit_id","title","description","file","uploaded_by","upload_date","tags","is_public","download_count")
        read_only_fields = ("uploaded_by","download_count","upload_date")