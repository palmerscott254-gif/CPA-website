from rest_framework.test import APITestCase


class AuthFlowsTest(APITestCase):
    def test_register_login_refresh_user(self):
        """Full auth flow: register -> login -> refresh -> user profile"""
        email = "e2e_test@example.com"
        password = "Testpass123"

        # Register
        register_resp = self.client.post(
            "/api/auth/register/",
            {"email": email, "password": password, "password2": password},
            format="json",
        )
        self.assertIn(register_resp.status_code, (200, 201))
        self.assertIn("access", register_resp.data)
        self.assertIn("refresh", register_resp.data)

        # Login
        login_resp = self.client.post(
            "/api/auth/login/",
            {"username": email, "password": password},
            format="json",
        )
        self.assertEqual(login_resp.status_code, 200)
        self.assertIn("access", login_resp.data)
        self.assertIn("refresh", login_resp.data)

        access = login_resp.data["access"]
        refresh = login_resp.data["refresh"]

        # Refresh
        refresh_resp = self.client.post(
            "/api/auth/refresh/", {"refresh": refresh}, format="json"
        )
        self.assertEqual(refresh_resp.status_code, 200)
        self.assertIn("access", refresh_resp.data)

        # Get user profile (protected)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        user_resp = self.client.get("/api/auth/user/")
        self.assertEqual(user_resp.status_code, 200)
        self.assertEqual(user_resp.data.get("email"), email)
