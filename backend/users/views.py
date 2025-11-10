from allauth.socialaccount.providers.google.provider import GoogleProvider
from allauth.socialaccount.models import SocialAccount
from allauth.socialaccount.helpers import complete_social_login
from allauth.socialaccount.adapter import get_adapter as get_social_adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Error
from django.contrib.auth import get_user_model
from django.conf import settings
import requests
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def google_id_token_login(request):
    """
    Accepts POST with {"id_token": ...}, verifies with Google, logs in/creates user, returns JWT tokens.
    """
    id_token = request.data.get("id_token")
    if not id_token:
        return Response({"detail": "Missing id_token"}, status=400)

    # Verify id_token with Google
    google_client_id = settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']
    token_info_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
    resp = requests.get(token_info_url)
    if resp.status_code != 200:
        return Response({"detail": "Invalid Google token"}, status=400)
    token_info = resp.json()
    if token_info.get("aud") != google_client_id:
        return Response({"detail": "Token audience mismatch"}, status=400)

    email = token_info.get("email")
    if not email:
        return Response({"detail": "No email in Google token"}, status=400)

    User = get_user_model()
    user, created = User.objects.get_or_create(email=email, defaults={
        "username": email,
        "first_name": token_info.get("given_name", ""),
        "last_name": token_info.get("family_name", ""),
    })
    if created:
        user.set_unusable_password()
        user.save()

    # Issue JWT tokens
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)
    user_data = UserSerializer(user).data
    return Response({
        "user": user_data,
        "access": access,
        "refresh": str(refresh),
    })
from rest_framework import generics, permissions
from .serializers import RegisterSerializer, UserSerializer
from .models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
import os

class AuthRootView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({
            "message": "CPA Academy Authentication API",
            "endpoints": {
                "register": "POST /api/auth/register/",
                "login": "POST /api/auth/login/",
                "refresh": "POST /api/auth/refresh/"
            },
            "usage": {
                "register": {
                    "method": "POST",
                    "fields": ["username", "email", "password", "password2", "first_name", "last_name"]
                },
                "login": {
                    "method": "POST", 
                    "fields": ["username", "password"]
                },
                "refresh": {
                    "method": "POST",
                    "fields": ["refresh"]
                }
            }
        })

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        """Create the user and return JWT tokens along with user data."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Create JWT tokens for the newly created user
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        user_data = UserSerializer(user).data

        return Response({
            "user": user_data,
            "access": access,
            "refresh": str(refresh)
        }, status=201)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["is_admin"] = user.is_admin
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class GoogleLogin(SocialLoginView):
    """
    Social login view for Google.

    Additionally, accept a POST with {'id_token': '...'} so the frontend can send
    a Google ID token (from the client-side One Tap / OAuth SDK). When an
    'id_token' is present we verify it with Google's tokeninfo endpoint, create
    or get the user, and return JWT access/refresh tokens (SimpleJWT).
    If no 'id_token' is provided, fall back to the normal SocialLoginView
    behavior which supports code/access_token flows via allauth/dj-rest-auth.
    """
    adapter_class = GoogleOAuth2Adapter
    callback_url = os.environ.get('GOOGLE_CALLBACK_URL', 'http://localhost:3000/google-callback')
    client_class = OAuth2Client

    def post(self, request, *args, **kwargs):
        # If frontend sends an id_token (One Tap / @react-oauth/google), handle it here.
        id_token = request.data.get('id_token')
        if id_token:
            # Verify id_token with Google
            google_client_id = settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']
            token_info_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
            resp = requests.get(token_info_url)
            if resp.status_code != 200:
                return Response({"detail": "Invalid Google token"}, status=400)
            token_info = resp.json()
            if token_info.get("aud") != google_client_id:
                return Response({"detail": "Token audience mismatch"}, status=400)

            email = token_info.get("email")
            if not email:
                return Response({"detail": "No email in Google token"}, status=400)

            User = get_user_model()
            user, created = User.objects.get_or_create(email=email, defaults={
                "username": email,
                "first_name": token_info.get("given_name", ""),
                "last_name": token_info.get("family_name", ""),
            })
            if created:
                user.set_unusable_password()
                user.save()

            # Issue JWT tokens
            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)
            user_data = UserSerializer(user).data
            return Response({
                "user": user_data,
                "access": access,
                "refresh": str(refresh),
            })

        # Otherwise fall back to default behavior (code/access_token via allauth)
        return super().post(request, *args, **kwargs)