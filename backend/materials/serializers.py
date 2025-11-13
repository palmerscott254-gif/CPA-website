from rest_framework import serializers
from .models import Material
from courses.models import Unit
from courses.serializers import UnitSerializer

class MaterialSerializer(serializers.ModelSerializer):
    unit = UnitSerializer(read_only=True)
    unit_id = serializers.PrimaryKeyRelatedField(queryset=Unit.objects.all(), source="unit", write_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Material
        fields = ("id","unit","unit_id","title","description","file","file_url","file_type","uploaded_by","upload_date","tags","is_public","download_count")
        read_only_fields = ("uploaded_by","download_count","upload_date","file_type")

    def get_file_url(self, obj):
        request = self.context.get("request")
        try:
            url = obj.file.url if obj.file else None
            if not url:
                return None
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        except Exception:
            return None
