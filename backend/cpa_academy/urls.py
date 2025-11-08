from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

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
    # dj-rest-auth endpoints for token-based auth (login, logout, password, etc.)
    path("api/auth/dj-rest-auth/", include("dj_rest_auth.urls")),
    # registration endpoints (includes social login integration via django-allauth)
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),
    path("api/subjects/", include("courses.urls")),
    path("api/materials/", include("materials.urls")),
    path("api/quizzes/", include("quizzes.urls")),
    # Browser-based social auth (redirect flow) -> /auth/login/google-oauth2/, /auth/complete/google-oauth2/
    # Use social_django URLs for the redirect flow; dj-rest-auth's social token endpoints are provided
    # by the registration include when dj-rest-auth[with_social] and django-allauth are installed.
    path("auth/", include("social_django.urls", namespace="social")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
