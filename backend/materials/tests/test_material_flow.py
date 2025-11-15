import os
import shutil
import tempfile
from django.test import override_settings
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from materials.models import Material
from courses.models import Subject, Unit


class MaterialFlowTests(APITestCase):
    def setUp(self):
        # Use a temporary media root to isolate file operations
        self.temp_media_dir = tempfile.mkdtemp()
        self.override = override_settings(MEDIA_ROOT=self.temp_media_dir, USE_S3=False)
        self.override.enable()

        User = get_user_model()
        self.user = User.objects.create_user(username="tester", email="test@example.com", password="pass123")
        self.client.force_authenticate(self.user)

        self.subject = Subject.objects.create(name="Subject A", slug="subject-a")
        self.unit = Unit.objects.create(subject=self.subject, title="Unit 1")

    def tearDown(self):
        self.override.disable()
        shutil.rmtree(self.temp_media_dir, ignore_errors=True)

    def test_full_material_lifecycle(self):
        # 1. Upload a new material
        upload_file = SimpleUploadedFile("sample.pdf", b"%PDF-1.4 test pdf content", content_type="application/pdf")
        create_url = "/api/materials/upload/"
        payload = {
            "unit_id": self.unit.id,
            "title": "My Material",
            "description": "Desc",
            "file": upload_file,
            "is_public": True,
            "tags": [],
        }
        create_resp = self.client.post(create_url, payload, format="multipart")
        self.assertEqual(create_resp.status_code, 201, create_resp.data)
        material_id = create_resp.data["id"]

        material = Material.objects.get(id=material_id)
        self.assertTrue(os.path.exists(material.file.path))

        # 2. Retrieve via detail endpoint
        detail_url = f"/api/materials/{material_id}/"
        detail_resp = self.client.get(detail_url)
        self.assertEqual(detail_resp.status_code, 200)
        self.assertEqual(detail_resp.data["id"], material_id)

        # 3. Download (should serve local file; status 200)
        download_url = f"/api/materials/{material_id}/download/"
        download_resp = self.client.get(download_url)
        self.assertEqual(download_resp.status_code, 200)

        # Ensure download_count incremented
        material.refresh_from_db()
        self.assertEqual(material.download_count, 1)

        # 4. Delete material via API
        file_path = material.file.path
        delete_resp = self.client.delete(detail_url)
        self.assertEqual(delete_resp.status_code, 204)
        self.assertFalse(os.path.exists(file_path))

        # 5. Confirm retrieval now 404
        missing_resp = self.client.get(detail_url)
        self.assertEqual(missing_resp.status_code, 404)
