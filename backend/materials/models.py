from django.db import models
from django.conf import settings

class Material(models.Model):
    unit = models.ForeignKey("courses.Unit", on_delete=models.CASCADE, related_name="materials")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to="materials/")
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    upload_date = models.DateTimeField(auto_now_add=True)
    tags = models.JSONField(default=list, blank=True)
    is_public = models.BooleanField(default=True)
    download_count = models.IntegerField(default=0)

    def __str__(self):
        return self.title
