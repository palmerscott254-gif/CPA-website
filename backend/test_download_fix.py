"""
Test script for material download functionality.
Run this from the Django shell to verify the download view works correctly.

Usage:
    python manage.py shell < test_download_fix.py

Or in Django shell:
    exec(open('test_download_fix.py').read())
"""

from materials.models import Material
from django.contrib.auth import get_user_model
from django.test import RequestFactory
from rest_framework.test import force_authenticate
from materials.views import material_download_view

User = get_user_model()

def test_download_view():
    """Test the material download view with various scenarios."""
    
    print("\n" + "="*60)
    print("TESTING MATERIAL DOWNLOAD VIEW")
    print("="*60)
    
    # Create test factory
    factory = RequestFactory()
    
    # Test 1: Non-existent material
    print("\n[Test 1] Testing non-existent material (ID: 99999)...")
    try:
        request = factory.get('/materials/99999/download/')
        # Get first user for authentication
        user = User.objects.first()
        if user:
            force_authenticate(request, user=user)
            response = material_download_view(request, pk=99999)
            print(f"  Status Code: {response.status_code}")
            print(f"  Response: {response.data}")
            assert response.status_code == 404, "Expected 404 for non-existent material"
            print("  ✓ PASSED")
        else:
            print("  ⚠ SKIPPED: No users in database")
    except Exception as e:
        print(f"  ✗ FAILED: {e}")
    
    # Test 2: Valid material
    print("\n[Test 2] Testing valid material download...")
    try:
        material = Material.objects.filter(file__isnull=False).exclude(file='').first()
        if material:
            request = factory.get(f'/materials/{material.id}/download/')
            user = User.objects.first()
            force_authenticate(request, user=user)
            response = material_download_view(request, pk=material.id)
            print(f"  Material ID: {material.id}")
            print(f"  Material Title: {material.title}")
            print(f"  File: {material.file.name}")
            print(f"  Status Code: {response.status_code}")
            
            if response.status_code == 200:
                if hasattr(response, 'data') and 'download_url' in response.data:
                    print(f"  Download URL: {response.data['download_url'][:100]}...")
                    print("  ✓ PASSED - S3 presigned URL generated")
                else:
                    print("  ✓ PASSED - File response generated")
            else:
                print(f"  Response: {response.data if hasattr(response, 'data') else 'No data'}")
                print("  ✗ FAILED: Expected 200 status")
        else:
            print("  ⚠ SKIPPED: No materials with files in database")
    except Exception as e:
        print(f"  ✗ FAILED: {e}")
        import traceback
        traceback.print_exc()
    
    # Test 3: Material without file
    print("\n[Test 3] Testing material without file...")
    try:
        # Try to find or create a material without a file
        material_no_file = Material.objects.filter(file='').first()
        if material_no_file:
            request = factory.get(f'/materials/{material_no_file.id}/download/')
            user = User.objects.first()
            force_authenticate(request, user=user)
            response = material_download_view(request, pk=material_no_file.id)
            print(f"  Material ID: {material_no_file.id}")
            print(f"  Status Code: {response.status_code}")
            print(f"  Response: {response.data}")
            assert response.status_code == 404, "Expected 404 for material without file"
            print("  ✓ PASSED")
        else:
            print("  ⚠ SKIPPED: No materials without files in database")
    except Exception as e:
        print(f"  ✗ FAILED: {e}")
    
    # Summary
    print("\n" + "="*60)
    print("Database Statistics:")
    print(f"  Total Materials: {Material.objects.count()}")
    print(f"  Materials with files: {Material.objects.exclude(file='').count()}")
    print(f"  Materials without files: {Material.objects.filter(file='').count()}")
    print(f"  Public materials: {Material.objects.filter(is_public=True).count()}")
    print(f"  Private materials: {Material.objects.filter(is_public=False).count()}")
    print("="*60 + "\n")

if __name__ == '__main__':
    test_download_view()
