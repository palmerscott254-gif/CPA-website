"""
Debug download endpoint to see exactly what's being returned.
"""
import os
import sys

os.environ['USE_S3'] = 'true'
os.environ['AWS_ACCESS_KEY_ID'] = 'AKIA6QBBGIPUST32XDFC'
os.environ['AWS_SECRET_ACCESS_KEY'] = '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'
os.environ['AWS_STORAGE_BUCKET_NAME'] = 'cpa-academy-media'
os.environ['AWS_S3_REGION_NAME'] = 'us-east-1'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cpa_academy.settings')

import django
django.setup()

from materials.models import Material
from django.test import RequestFactory
from rest_framework.test import force_authenticate
from users.models import User
from materials.views import material_download_view
import json

print("=" * 80)
print("DOWNLOAD ENDPOINT DEBUG TEST")
print("=" * 80)

# Get a test material
material = Material.objects.filter(file__isnull=False).first()
if not material:
    print("\n✗ No materials found to test")
    sys.exit(1)

print(f"\nTesting Material ID {material.id}: {material.title}")
print(f"File: {material.file.name}")
print(f"File type: {material.file_type}")
print(f"Is public: {material.is_public}")

# Get or create a test user
user, created = User.objects.get_or_create(
    email='test@example.com',
    defaults={
        'first_name': 'Test',
        'last_name': 'User',
        'is_active': True
    }
)
if created:
    user.set_password('testpass123')
    user.save()

print(f"\nTest user: {user.email} (ID: {user.id})")

# Create a mock request
factory = RequestFactory()
request = factory.get(f'/api/materials/{material.id}/download/')
force_authenticate(request, user=user)

print("\n" + "=" * 80)
print("CALLING DOWNLOAD ENDPOINT...")
print("=" * 80)

# Call the view
response = material_download_view(request, pk=material.id)

print(f"\nResponse Status: {response.status_code}")
print(f"Response Type: {type(response).__name__}")
print(f"Content-Type: {response.get('Content-Type', 'Not set')}")

if hasattr(response, 'data'):
    print(f"\nResponse Data:")
    print(json.dumps(response.data, indent=2))
    
    if 'download_url' in response.data:
        url = response.data['download_url']
        print(f"\n✓ Presigned URL generated!")
        print(f"URL length: {len(url)}")
        print(f"URL starts with: {url[:100]}...")
        
        # Test the URL
        import requests
        print("\nTesting presigned URL...")
        try:
            r = requests.head(url, timeout=5)
            print(f"✓ URL is accessible! Status: {r.status_code}")
            print(f"Content-Length: {r.headers.get('Content-Length', 'Unknown')}")
            print(f"Content-Type: {r.headers.get('Content-Type', 'Unknown')}")
        except Exception as e:
            print(f"✗ URL test failed: {e}")

print("\n" + "=" * 80)
print("TEST COMPLETE")
print("=" * 80)
