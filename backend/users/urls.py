from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView, AuthRootView, UserProfileView, GoogleLogin, google_id_token_login
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("", AuthRootView.as_view(), name="auth_root"),
    path("register/", RegisterView.as_view(), name="auth_register"),
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("user/", UserProfileView.as_view(), name="user_profile"),
    # Social login endpoint for Google. Frontend should POST an id_token to /api/auth/google/
    # (handled by GoogleLogin.post which accepts {'id_token': '...'})
    path("google/", GoogleLogin.as_view(), name="google_login"),
    # Keep a backwards-compatible explicit id_token endpoint (optional)
    path("google/id-token/", google_id_token_login, name="google_id_token_login"),
]
