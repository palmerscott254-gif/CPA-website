"""
Custom storage backends for handling media files.
Uses S3 in production and local filesystem in development.
"""
from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage


class MediaStorage(S3Boto3Storage):
    """
    Custom S3 storage for media files with specific settings.
    """
    location = 'media'
    file_overwrite = False
    default_acl = 'private'
