from django.db import models
from django.utils.text import slugify

class Subject(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Unit(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="units")
    title = models.CharField(max_length=255)
    code = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.title
