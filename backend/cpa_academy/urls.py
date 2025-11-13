from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.http import JsonResponse
from django.views.static import serve

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

urlpatterns = [
    path("", api_root, name="api_root"),
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.urls")),
    path("api/auth/", include("dj_rest_auth.urls")),
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),
    path("api/subjects/", include("courses.urls")),
    path("api/materials/", include("materials.urls")),
    path("api/quizzes/", include("quizzes.urls")),
]

# Serve media files. This is not recommended for production environments.
# A better approach is to use a dedicated file storage service like AWS S3 or Google Cloud Storage,
# and have Nginx or another web server serve the files directly.
# However, for simplicity on platforms like Render, this will work.
if settings.DEBUG:
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += [
        re_path(r'^%s(?P<path>.*)$' % settings.MEDIA_URL.lstrip('/'), serve, {'document_root': settings.MEDIA_ROOT}),
    ]

