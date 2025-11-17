"""
Test script to upload a PDF directly to S3 and verify it stays there.
IMPORTANT: Environment variables must be set BEFORE Django imports settings.
"""
import os
import sys

# Set ALL environment variables BEFORE any Django imports
os.environ['USE_S3'] = 'true'
os.environ['AWS_ACCESS_KEY_ID'] = 'AKIA6QBBGIPUST32XDFC'
os.environ['AWS_SECRET_ACCESS_KEY'] = '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'
os.environ['AWS_STORAGE_BUCKET_NAME'] = 'cpa-academy-media'
os.environ['AWS_S3_REGION_NAME'] = 'us-east-1'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cpa_academy.settings')

# NOW import and setup Django
import django
django.setup()

from django.core.files.base import ContentFile
from courses.models import Subject, Unit
from materials.models import Material
from django.conf import settings
import boto3

# Import storage AFTER Django setup and print what we get
from django.core.files.storage import default_storage

print("=" * 60)
print("Direct S3 Upload Test")
print("=" * 60)

# Debug: Show what Django sees
print(f"\nDjango settings debug:")
print(f"  settings.USE_S3 = {getattr(settings, 'USE_S3', 'NOT SET')}")
print(f"  settings.DEFAULT_FILE_STORAGE = {getattr(settings, 'DEFAULT_FILE_STORAGE', 'NOT SET')}")
print(f"  os.environ['USE_S3'] = {os.environ.get('USE_S3', 'NOT SET')}")
print(f"\nChecking storage backend:")
print(f"  default_storage class: {default_storage.__class__}")
print(f"  default_storage module: {default_storage.__class__.__module__}")

# Force re-import to get fresh storage
from django.core.files import storage as storage_module
from importlib import reload
reload(storage_module)
from django.core.files.storage import default_storage as fresh_storage
print(f"  fresh_storage class after reload: {fresh_storage.__class__}")

# Check storage backend
print(f"\nStorage backend: {default_storage.__class__.__name__}")
print(f"Storage location: {getattr(default_storage, 'location', 'N/A')}")
print(f"Bucket: {getattr(default_storage, 'bucket_name', 'N/A')}")

# Create minimal PDF
pdf_content = (
    b"%PDF-1.4\n"
    b"1 0 obj<<>>endobj\n"
    b"2 0 obj<< /Length 0 >>stream\nendstream\nendobj\n"
    b"3 0 obj<< /Type /Page /Parent 4 0 R /MediaBox [0 0 200 200] >>endobj\n"
    b"4 0 obj<< /Type /Pages /Count 1 /Kids [3 0 R] >>endobj\n"
    b"5 0 obj<< /Type /Catalog /Pages 4 0 R >>endobj\n"
    b"xref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n"
    b"trailer<< /Size 6 /Root 5 0 R >>\nstartxref\n290\n%%EOF\n"
)

# Test 1: Direct storage upload
print("\n" + "=" * 60)
print("Test 1: Direct storage.save()")
print("=" * 60)
try:
    filename = 'test-direct-upload.pdf'
    path = default_storage.save(filename, ContentFile(pdf_content))
    print(f"✓ Saved to: {path}")
    
    exists = default_storage.exists(path)
    print(f"✓ Exists check: {exists}")
    
    size = default_storage.size(path)
    print(f"✓ Size: {size} bytes")
    
    url = default_storage.url(path)
    print(f"✓ URL: {url[:80]}...")
    
    # Verify with boto3
    s3 = boto3.client(
        's3',
        region_name='us-east-1',
        aws_access_key_id='AKIA6QBBGIPUST32XDFC',
        aws_secret_access_key='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'
    )
    
    response = s3.list_objects_v2(Bucket='cpa-academy-media')
    if 'Contents' in response:
        print(f"\n✓ boto3 verification: Found {len(response['Contents'])} objects in bucket:")
        for obj in response['Contents']:
            print(f"  - {obj['Key']} ({obj['Size']} bytes)")
    else:
        print("\n✗ boto3 verification: Bucket is empty!")
        
except Exception as e:
    print(f"\n✗ Error: {e}")
    import traceback
    traceback.print_exc()

# Test 2: Material model upload
print("\n" + "=" * 60)
print("Test 2: Material model with file upload")
print("=" * 60)
try:
    subject, _ = Subject.objects.get_or_create(
        name="Test Subject",
        defaults={"slug": "test-subject"}
    )
    unit, _ = Unit.objects.get_or_create(
        subject=subject,
        title="Test Unit"
    )
    
    material = Material(
        unit=unit,
        title="Direct Upload Test PDF",
        description="Testing S3 upload",
        is_public=True
    )
    
    material.file.save('test-material.pdf', ContentFile(pdf_content), save=True)
    
    print(f"✓ Material created: ID={material.id}")
    print(f"✓ File field name: {material.file.name}")
    print(f"✓ File URL: {material.file.url[:80]}...")
    
    # List bucket again
    response = s3.list_objects_v2(Bucket='cpa-academy-media')
    if 'Contents' in response:
        print(f"\n✓ After Material creation: {len(response['Contents'])} objects in bucket:")
        for obj in response['Contents']:
            print(f"  - {obj['Key']} ({obj['Size']} bytes)")
    else:
        print("\n✗ Bucket still empty after Material creation!")
        
except Exception as e:
    print(f"\n✗ Error: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("Test complete")
print("=" * 60)
