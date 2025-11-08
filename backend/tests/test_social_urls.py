from django.urls import resolve
from django.test import SimpleTestCase


class SocialUrlsTests(SimpleTestCase):
    def test_dj_rest_auth_social_login_url_resolves(self):
        """Resolve the dj-rest-auth social login URL for Google (token-exchange)."""
        # The URL that dj-rest-auth.social_urls exposes for provider-based login
        path = "/api/auth/dj-rest-auth/social/login/google-oauth2/"
        resolver = resolve(path)
        # If resolve didn't raise, the URL exists; assert the view callable is not None
        self.assertIsNotNone(resolver.func)
