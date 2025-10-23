from rest_framework import generics, permissions
from .serializers import RegisterSerializer, UserSerializer
from .models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["is_admin"] = user.is_admin
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
