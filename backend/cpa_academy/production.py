from .settings import *
import os

# Production settings
DEBUG = False
ALLOWED_HOSTS = [
    "cpa-website-lvup.onrender.com",
    "cpa-website-1.onrender.com",
]
allowed_hosts_env = os.getenv("DJANGO_ALLOWED_HOSTS")
if allowed_hosts_env:
    ALLOWED_HOSTS.extend(allowed_hosts_env.split(","))

# Security settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Database configuration for production
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# S3 Media Storage Configuration (override base settings if needed)
USE_S3 = True
AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME", "cpa-academy-media")
AWS_S3_REGION_NAME = os.getenv("AWS_S3_REGION_NAME", "us-east-1")

# Ensure media is not stored locally in production
# MEDIA_ROOT is intentionally not set when using S3

# CORS settings for production - extend the base settings, don't replace
# Add production-specific origins if needed
production_origins = os.getenv("PRODUCTION_CORS_ORIGINS", "").split(",")
if production_origins and production_origins[0]:
    CORS_ALLOWED_ORIGINS.extend([origin.strip() for origin in production_origins if origin.strip()])

# Ensure CSRF trusted origins include production domains
production_csrf_origins = os.getenv("PRODUCTION_CSRF_ORIGINS", "").split(",")
if production_csrf_origins and production_csrf_origins[0]:
    CSRF_TRUSTED_ORIGINS.extend([origin.strip() for origin in production_csrf_origins if origin.strip()])

# Email configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_PORT = os.getenv('EMAIL_PORT', 587)
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
