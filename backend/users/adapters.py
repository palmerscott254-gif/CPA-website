from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def get_login_redirect_url(self, request, socialaccount):
        user = socialaccount.user
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        redirect_url = f"{settings.LOGIN_REDIRECT_URL}?access_token={access_token}&refresh_token={refresh_token}"
        return redirect_url
