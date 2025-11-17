"""
Test specific file that's causing download issues.
"""
import boto3
import requests

ACCESS_KEY = 'AKIA6QBBGIPUST32XDFC'
SECRET_KEY = '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'
BUCKET = 'cpa-academy-media'
REGION = 'us-east-1'

s3 = boto3.client(
    's3',
    region_name=REGION,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY
)

test_key = 'materials/New_Financial_Accounting.pdf'

print("=" * 80)
print(f"TESTING FILE: {test_key}")
print("=" * 80)

# Check if file exists
print("\n1. Checking if file exists...")
try:
    response = s3.head_object(Bucket=BUCKET, Key=test_key)
    print(f"   ✓ File exists!")
    print(f"   Size: {response['ContentLength']} bytes")
    print(f"   Content-Type: {response.get('ContentType', 'Unknown')}")
    print(f"   Last Modified: {response.get('LastModified', 'Unknown')}")
except Exception as e:
    print(f"   ✗ File not found: {e}")

# Direct download
print("\n2. Testing direct download...")
try:
    obj = s3.get_object(Bucket=BUCKET, Key=test_key)
    content = obj['Body'].read()
    print(f"   ✓ Direct download works! Got {len(content)} bytes")
    print(f"   First 100 bytes: {content[:100]}")
except Exception as e:
    print(f"   ✗ Failed: {e}")

# Presigned URL
print("\n3. Testing presigned URL...")
try:
    url = s3.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': BUCKET,
            'Key': test_key,
            'ResponseContentDisposition': f'attachment; filename="New_Financial_Accounting.pdf"'
        },
        ExpiresIn=3600
    )
    print(f"   ✓ Generated presigned URL")
    print(f"   URL: {url}")
    
    print("\n   Testing URL with requests.get()...")
    r = requests.get(url)
    print(f"   Status: {r.status_code}")
    print(f"   Headers: {dict(r.headers)}")
    
    if r.status_code == 200:
        print(f"   ✓✓✓ SUCCESS! Downloaded {len(r.content)} bytes")
    else:
        print(f"   ✗✗✗ FAILED!")
        print(f"   Response: {r.text[:500]}")
        
except Exception as e:
    print(f"   ✗ Failed: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 80)
