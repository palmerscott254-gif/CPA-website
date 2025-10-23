from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView, AuthRootView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("", AuthRootView.as_view(), name="auth_root"),
    path("register/", RegisterView.as_view(), name="auth_register"),
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
