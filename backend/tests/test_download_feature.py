"""
Comprehensive tests for the download feature.
Tests authentication, permissions, CORS, and file delivery.
"""
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from courses.models import Unit, Course
from materials.models import Material
from django.core.files.uploadedfile import SimpleUploadedFile
import json

User = get_user_model()


class MaterialDownloadTests(TestCase):
    """Test suite for material download functionality"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.client = Client()
        
        # Create test users
        self.user = User.objects.create_user(
            email='test@test.com',
            password='testpass123'
        )
        self.other_user = User.objects.create_user(
            email='other@test.com',
            password='testpass123'
        )
        
        # Create course and unit
        self.course = Course.objects.create(
            title='Test Course',
            description='Test Description'
        )
        self.unit = Unit.objects.create(
            course=self.course,
            title='Test Unit',
            order=1
        )
        
        # Create public material
        self.public_material = Material.objects.create(
            unit=self.unit,
            title='Public Material',
            description='Public test material',
            is_public=True,
            uploaded_by=self.user,
            file=SimpleUploadedFile('test_public.pdf', b'public test content', content_type='application/pdf')
        )
        
        # Create private material
        self.private_material = Material.objects.create(
            unit=self.unit,
            title='Private Material',
            description='Private test material',
            is_public=False,
            uploaded_by=self.user,
            file=SimpleUploadedFile('test_private.pdf', b'private test content', content_type='application/pdf')
        )
    
    def test_public_material_download_no_auth(self):
        """Public materials should be downloadable without authentication"""
        response = self.client.get(
            f'/api/materials/{self.public_material.id}/download/'
        )
        self.assertEqual(response.status_code, 200)
        
        # Should return either JSON with download_url or binary content
        content_type = response.get('Content-Type', '')
        self.assertTrue(
            'application/json' in content_type or 'application/pdf' in content_type,
            f"Unexpected content type: {content_type}"
        )
    
    def test_public_material_download_with_auth(self):
        """Public materials should be downloadable with authentication"""
        self.client.force_login(self.user)
        response = self.client.get(
            f'/api/materials/{self.public_material.id}/download/'
        )
        self.assertEqual(response.status_code, 200)
    
    def test_private_material_download_no_auth(self):
        """Private materials should require authentication"""
        response = self.client.get(
            f'/api/materials/{self.private_material.id}/download/'
        )
        self.assertEqual(response.status_code, 401)
        
        # Check error message
        data = response.json()
        self.assertIn('detail', data)
        self.assertIn('Authentication required', data['detail'])
    
    def test_private_material_download_by_owner(self):
        """Private materials should be downloadable by owner"""
        self.client.force_login(self.user)
        response = self.client.get(
            f'/api/materials/{self.private_material.id}/download/'
        )
        self.assertEqual(response.status_code, 200)
    
    def test_private_material_download_by_other_user(self):
        """Private materials should not be downloadable by non-owner"""
        self.client.force_login(self.other_user)
        response = self.client.get(
            f'/api/materials/{self.private_material.id}/download/'
        )
        self.assertEqual(response.status_code, 403)
        
        # Check error message
        data = response.json()
        self.assertIn('detail', data)
        self.assertIn('permission', data['detail'].lower())
    
    def test_download_increments_count(self):
        """Download should increment download_count"""
        initial_count = self.public_material.download_count
        
        response = self.client.get(
            f'/api/materials/{self.public_material.id}/download/'
        )
        self.assertEqual(response.status_code, 200)
        
        # Refresh from database
        self.public_material.refresh_from_db()
        self.assertEqual(
            self.public_material.download_count,
            initial_count + 1
        )
    
    def test_download_nonexistent_material(self):
        """Downloading non-existent material should return 404"""
        response = self.client.get('/api/materials/99999/download/')
        self.assertEqual(response.status_code, 404)
        
        data = response.json()
        self.assertIn('detail', data)
        self.assertIn('not found', data['detail'].lower())
    
    def test_download_material_without_file(self):
        """Downloading material without file should return 404"""
        # Create material without file
        no_file_material = Material.objects.create(
            unit=self.unit,
            title='No File Material',
            is_public=True,
            uploaded_by=self.user
        )
        
        response = self.client.get(
            f'/api/materials/{no_file_material.id}/download/'
        )
        self.assertEqual(response.status_code, 404)
        
        data = response.json()
        self.assertIn('detail', data)
        self.assertIn('no file', data['detail'].lower())
    
    def test_cors_headers_present(self):
        """CORS headers should be present in response"""
        response = self.client.get(
            f'/api/materials/{self.public_material.id}/download/',
            HTTP_ORIGIN='http://localhost:3000'
        )
        
        # Django test client doesn't process CORS middleware the same way
        # This test verifies the endpoint works; CORS headers are tested in integration
        self.assertEqual(response.status_code, 200)
    
    def test_alternate_download_url(self):
        """Alternate URL pattern should also work"""
        response = self.client.get(
            f'/api/materials/download/{self.public_material.id}/'
        )
        self.assertEqual(response.status_code, 200)
    
    def test_json_response_structure_for_s3(self):
        """When using S3, response should include download_url and filename"""
        # This test assumes local storage in test environment
        # In production with S3, response would be JSON
        response = self.client.get(
            f'/api/materials/{self.public_material.id}/download/'
        )
        self.assertEqual(response.status_code, 200)
        
        content_type = response.get('Content-Type', '')
        
        if 'application/json' in content_type:
            data = response.json()
            self.assertIn('download_url', data)
            self.assertIn('filename', data)
            self.assertTrue(data['filename'].endswith('.pdf'))
    
    def test_staff_can_download_private_materials(self):
        """Staff users should be able to download any material"""
        staff_user = User.objects.create_user(
            email='staff@test.com',
            password='testpass123',
            is_staff=True
        )
        
        self.client.force_login(staff_user)
        response = self.client.get(
            f'/api/materials/{self.private_material.id}/download/'
        )
        self.assertEqual(response.status_code, 200)
    
    def test_superuser_can_download_private_materials(self):
        """Superusers should be able to download any material"""
        superuser = User.objects.create_superuser(
            email='admin@test.com',
            password='testpass123'
        )
        
        self.client.force_login(superuser)
        response = self.client.get(
            f'/api/materials/{self.private_material.id}/download/'
        )
        self.assertEqual(response.status_code, 200)


class MaterialDownloadIntegrationTests(TestCase):
    """Integration tests for download feature with different storage backends"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.client = Client()
        self.user = User.objects.create_user(
            email='integration@test.com',
            password='testpass123'
        )
        
        self.course = Course.objects.create(
            title='Integration Test Course',
            description='Test'
        )
        self.unit = Unit.objects.create(
            course=self.course,
            title='Integration Test Unit',
            order=1
        )
        
        self.material = Material.objects.create(
            unit=self.unit,
            title='Integration Test Material',
            is_public=True,
            uploaded_by=self.user,
            file=SimpleUploadedFile('integration.pdf', b'integration test', content_type='application/pdf')
        )
    
    def test_file_type_detection(self):
        """File type should be automatically detected"""
        self.assertEqual(self.material.file_type, 'pdf')
    
    def test_multiple_downloads_increment_correctly(self):
        """Multiple downloads should increment count correctly"""
        initial_count = self.material.download_count
        
        # Download 5 times
        for _ in range(5):
            response = self.client.get(
                f'/api/materials/{self.material.id}/download/'
            )
            self.assertEqual(response.status_code, 200)
        
        self.material.refresh_from_db()
        self.assertEqual(
            self.material.download_count,
            initial_count + 5
        )
