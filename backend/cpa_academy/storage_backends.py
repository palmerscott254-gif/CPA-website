"""
Custom storage backends for handling media files.
Uses S3 with private access in production and local filesystem in development.
All files require authentication via presigned URLs.
"""
from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage


class MediaStorage(S3Boto3Storage):
    """
    Custom S3 storage for media files with private access.
    Files are stored privately and accessed via presigned URLs.
    """
    location = 'media'
    file_overwrite = False
    default_acl = None  # Inherit bucket's default (should be private)
    querystring_auth = True  # Enable presigned URL generation
    custom_domain = False  # Don't use custom domain for presigned URLs

