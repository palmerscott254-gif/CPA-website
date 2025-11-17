from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.http import JsonResponse
from django.core.files.storage import default_storage

# Import admin configuration to apply custom headers and titles
from . import custom_admin

def api_root(request):
    return JsonResponse({
        "message": "CPA Academy API",
        "version": "1.0",
        "endpoints": {
            "admin": "/admin/",
            "authentication": "/api/auth/",
            "subjects": "/api/subjects/",
            "materials": "/api/materials/",
            "quizzes": "/api/quizzes/"
        }
    })

def storage_health(request):
    try:
        storage_class = default_storage.__class__.__name__
        return JsonResponse({
            "use_s3": getattr(settings, 'USE_S3', False),
            "default_file_storage": settings.DEFAULT_FILE_STORAGE,
            "storage_class": storage_class,
            "media_url": settings.MEDIA_URL,
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

urlpatterns = [
    path("", api_root, name="api_root"),
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.urls")),
    path("api/auth/", include("dj_rest_auth.urls")),
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),
    path("api/subjects/", include("courses.urls")),
    path("api/materials/", include("materials.urls")),
    path("api/quizzes/", include("quizzes.urls")),
    path("api/health/storage/", storage_health, name="storage_health"),
]

# Only serve media files locally in development
# In production with S3, files are served directly from S3
if settings.DEBUG and not getattr(settings, 'USE_S3', False):
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

