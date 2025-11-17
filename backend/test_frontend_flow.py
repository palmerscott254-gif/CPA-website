"""
Simulate the exact frontend download flow to identify the issue.
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

from materials.models import Material
import requests
import json

print("=" * 80)
print("SIMULATE FRONTEND DOWNLOAD FLOW")
print("=" * 80)

# Step 1: Get a material
material = Material.objects.filter(id=23).first()
if not material:
    print("\n✗ Material ID 23 not found")
    import sys
    sys.exit(1)

print(f"\nMaterial ID {material.id}: {material.title}")
print(f"File: {material.file.name}")

# Step 2: Simulate API call to download endpoint
print("\n" + "=" * 80)
print("STEP 1: Frontend calls /api/materials/23/download/")
print("=" * 80)

# Get auth token (simulate login)
login_url = "http://localhost:8000/api/auth/login/"
login_data = {"email": "admin@example.com", "password": "admin123"}

print(f"\nLogging in as admin...")
try:
    login_resp = requests.post(login_url, json=login_data)
    if login_resp.status_code == 200:
        tokens = login_resp.json()
        access_token = tokens.get('access')
        print(f"✓ Got access token: {access_token[:50]}...")
    else:
        print(f"✗ Login failed: {login_resp.status_code}")
        print(f"  Response: {login_resp.text}")
        access_token = None
except Exception as e:
    print(f"✗ Login request failed: {e}")
    access_token = None

# Call download endpoint
download_url = f"http://localhost:8000/api/materials/{material.id}/download/"
headers = {}
if access_token:
    headers['Authorization'] = f'Bearer {access_token}'

print(f"\nCalling download endpoint: {download_url}")
print(f"Headers: {headers}")

try:
    download_resp = requests.get(download_url, headers=headers)
    print(f"\nStatus: {download_resp.status_code}")
    print(f"Content-Type: {download_resp.headers.get('Content-Type')}")
    
    if download_resp.status_code == 200:
        content_type = download_resp.headers.get('Content-Type', '')
        
        if 'application/json' in content_type:
            data = download_resp.json()
            print(f"\n✓ Got JSON response with presigned URL")
            print(f"Response: {json.dumps(data, indent=2)}")
            
            if 'download_url' in data:
                presigned_url = data['download_url']
                
                # Step 3: Frontend fetches from presigned URL
                print("\n" + "=" * 80)
                print("STEP 2: Frontend fetches from presigned URL")
                print("=" * 80)
                print(f"\nURL: {presigned_url[:100]}...")
                
                print(f"\nFetching file...")
                file_resp = requests.get(presigned_url, stream=True)
                print(f"Status: {file_resp.status_code}")
                print(f"Headers: {dict(file_resp.headers)}")
                
                if file_resp.status_code == 200:
                    # Read first chunk
                    content = b''
                    for chunk in file_resp.iter_content(chunk_size=1024):
                        if chunk:
                            content += chunk
                            if len(content) >= 10000:  # Just get first 10KB
                                break
                    
                    print(f"\n✓✓✓ SUCCESS! Downloaded {len(content)} bytes")
                    print(f"First 100 bytes: {content[:100]}")
                else:
                    print(f"\n✗✗✗ FAILED TO DOWNLOAD FROM PRESIGNED URL")
                    print(f"Response: {file_resp.text[:500]}")
        else:
            print(f"\n✓ Got binary file response (local file)")
            print(f"Content-Length: {download_resp.headers.get('Content-Length')}")
    else:
        print(f"\n✗ Download endpoint failed")
        print(f"Response: {download_resp.text}")
        
except Exception as e:
    print(f"\n✗ Request failed: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 80)
