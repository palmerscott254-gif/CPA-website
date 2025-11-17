"""
Quick test to verify presigned URLs work with the updated code.
"""
import os
os.environ['USE_S3'] = 'true'
os.environ['AWS_ACCESS_KEY_ID'] = 'AKIA6QBBGIPUST32XDFC'
os.environ['AWS_SECRET_ACCESS_KEY'] = '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'
os.environ['AWS_STORAGE_BUCKET_NAME'] = 'cpa-academy-media'
os.environ['AWS_S3_REGION_NAME'] = 'us-east-1'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cpa_academy.settings')

import django
django.setup()

from materials.views import generate_s3_presigned_url
import requests

print("=" * 80)
print("TEST PRESIGNED URL GENERATION")
print("=" * 80)

# Test the function
test_key = 'materials/New_Financial_Accounting.pdf'
print(f"\nGenerating presigned URL for: {test_key}")

url = generate_s3_presigned_url(test_key, expiration=600)

if url:
    print(f"✓ URL generated!")
    print(f"\nURL: {url}")
    
    # Test the URL
    print(f"\nTesting URL...")
    try:
        r = requests.head(url, timeout=10)
        print(f"HEAD request status: {r.status_code}")
        
        if r.status_code == 200:
            print(f"✓✓✓ SUCCESS! URL is valid")
            print(f"Content-Length: {r.headers.get('Content-Length')}")
            print(f"Content-Type: {r.headers.get('Content-Type')}")
            
            # Try actually downloading
            print(f"\nDownloading file...")
            r2 = requests.get(url, timeout=30)
            if r2.status_code == 200:
                print(f"✓✓✓ FILE DOWNLOADED! {len(r2.content)} bytes")
            else:
                print(f"✗ Download failed: {r2.status_code}")
        elif r.status_code == 403:
            print(f"✗✗✗ FORBIDDEN - Check IAM permissions")
            print(f"Response: {r.text}")
        else:
            print(f"✗ Unexpected status: {r.status_code}")
            print(f"Response: {r.text}")
    except Exception as e:
        print(f"✗ Request failed: {e}")
else:
    print(f"✗ Failed to generate URL")

print("\n" + "=" * 80)
