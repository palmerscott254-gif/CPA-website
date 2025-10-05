from rest_framework import serializers
from .models import Subject, Unit

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ("id", "title", "code", "description", "order")

class SubjectSerializer(serializers.ModelSerializer):
    units = UnitSerializer(many=True, read_only=True)
    
    class Meta:
        model = Subject
        fields = ("id", "name", "slug", "units")