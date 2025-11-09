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
    adapter_class = GoogleOAuth2Adapter
    callback_url = os.environ.get('GOOGLE_CALLBACK_URL', 'http://localhost:3000/google-callback')
    client_class = OAuth2Client