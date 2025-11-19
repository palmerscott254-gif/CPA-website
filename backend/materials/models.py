from django.db import models
from django.conf import settings

def material_upload_path(instance, filename):
    """
    Generate upload path for material files.
    Ensures files go to 'materials/' directory in storage (S3 or local).
    """
    import os
    # Sanitize filename to prevent path traversal
    safe_filename = os.path.basename(filename)
    return f"materials/{safe_filename}"


class Material(models.Model):
    unit = models.ForeignKey("courses.Unit", on_delete=models.CASCADE, related_name="materials")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to=material_upload_path)
    file_type = models.CharField(max_length=10, blank=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    upload_date = models.DateTimeField(auto_now_add=True)
    tags = models.JSONField(default=list, blank=True)
    is_public = models.BooleanField(default=True)
    download_count = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        if self.file:
            # Extract file extension
            file_name = self.file.name
            if '.' in file_name:
                self.file_type = file_name.split('.')[-1].lower()
            else:
                self.file_type = 'unknown'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
