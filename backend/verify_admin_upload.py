"""
Automated admin PDF upload test via Django shell.
Creates a Material with a PDF file through the admin workflow.
"""
import os
import sys

# Set env vars before Django loads
os.environ['USE_S3'] = 'true'
os.environ['AWS_ACCESS_KEY_ID'] = 'AKIA6QBBGIPUST32XDFC'
os.environ['AWS_SECRET_ACCESS_KEY'] = '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'
os.environ['AWS_STORAGE_BUCKET_NAME'] = 'cpa-academy-media'
os.environ['AWS_S3_REGION_NAME'] = 'us-east-1'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cpa_academy.settings')

import django
django.setup()

from django.core.files.base import ContentFile
from courses.models import Subject, Unit
from materials.models import Material
from django.conf import settings
import boto3

print("=" * 70)
print("ADMIN PDF UPLOAD VERIFICATION")
print("=" * 70)

# Verify S3 is active
print(f"\n✓ Storage backend: {settings.STORAGES['default']['BACKEND']}")
print(f"✓ Bucket: {settings.AWS_STORAGE_BUCKET_NAME}")
print(f"✓ Region: {settings.AWS_S3_REGION_NAME}")

# Create test structure
subject, _ = Subject.objects.get_or_create(
    name="CPA Review",
    defaults={"slug": "cpa-review"}
)
unit, _ = Unit.objects.get_or_create(
    subject=subject,
    title="Financial Accounting",
    defaults={"code": "FAR-101", "order": 1}
)

print(f"\n✓ Subject: {subject.name}")
print(f"✓ Unit: {unit.title}")

# Create a realistic PDF
pdf_content = b"""%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj
4 0 obj
<<
/Length 55
>>
stream
BT
/F1 24 Tf
100 700 Td
(CPA Study Material) Tj
ET
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000270 00000 n 
0000000374 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
457
%%EOF
"""

# Upload via Material model (simulates admin upload)
material = Material(
    unit=unit,
    title="Financial Accounting Study Guide",
    description="Comprehensive study guide for FAR section",
    is_public=True,
    tags=["accounting", "far", "study-guide"]
)

print("\nUploading PDF to S3...")
material.file.save('FAR_Study_Guide.pdf', ContentFile(pdf_content), save=True)

print(f"\n✓ Material created: ID={material.id}")
print(f"✓ Title: {material.title}")
print(f"✓ File key: {material.file.name}")
print(f"✓ File size: {material.file.size} bytes")
print(f"✓ File type: {material.file_type}")

# Get URL
url = material.file.url
print(f"\n✓ S3 URL generated:")
print(f"  {url[:100]}...")

# Verify with boto3
s3 = boto3.client(
    's3',
    region_name='us-east-1',
    aws_access_key_id='AKIA6QBBGIPUST32XDFC',
    aws_secret_access_key='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'
)

try:
    response = s3.head_object(
        Bucket='cpa-academy-media',
        Key=material.file.name
    )
    print(f"\n✓ boto3 verification successful:")
    print(f"  Object exists in S3")
    print(f"  Size: {response['ContentLength']} bytes")
    print(f"  Last modified: {response['LastModified']}")
    print(f"  Content type: {response.get('ContentType', 'N/A')}")
except Exception as e:
    print(f"\n✗ boto3 verification failed: {e}")

# List all materials in bucket
print("\n" + "=" * 70)
print("ALL MATERIALS IN S3 BUCKET")
print("=" * 70)

response = s3.list_objects_v2(Bucket='cpa-academy-media', Prefix='materials/')
if 'Contents' in response:
    print(f"\nFound {len(response['Contents'])} objects:")
    for obj in response['Contents']:
        print(f"  - {obj['Key']} ({obj['Size']} bytes)")
else:
    print("\nNo objects found in materials/ prefix")

print("\n" + "=" * 70)
print("✓ ADMIN UPLOAD VERIFICATION COMPLETE")
print("=" * 70)
print(f"\nYou can now:")
print(f"1. Visit http://127.0.0.1:8000/admin/materials/material/")
print(f"2. View the uploaded material (ID {material.id})")
print(f"3. Upload more PDFs via the admin interface")
print(f"4. Check your S3 bucket: https://s3.console.aws.amazon.com/s3/buckets/cpa-academy-media")
