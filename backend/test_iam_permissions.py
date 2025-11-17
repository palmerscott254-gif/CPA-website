"""
Test IAM user permissions for S3 bucket operations.
"""
import boto3
from botocore.exceptions import ClientError

# Your credentials
ACCESS_KEY = 'AKIA6QBBGIPUST32XDFC'
SECRET_KEY = 'tiDdMSD3nrsGe9JcSBXh1ML7pea02VkJoLZ64hnL'
BUCKET = 'cpa-academy-media'
REGION = 'us-east-1'

print("=" * 80)
print("IAM USER PERMISSIONS TEST")
print("=" * 80)

s3 = boto3.client(
    's3',
    region_name=REGION,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY
)

# Test 1: List bucket
print("\n1. Testing s3:ListBucket permission...")
try:
    response = s3.list_objects_v2(Bucket=BUCKET, MaxKeys=5)
    print(f"   ✓ Can list bucket (found {response.get('KeyCount', 0)} objects)")
except ClientError as e:
    print(f"   ✗ FAILED: {e.response['Error']['Code']} - {e.response['Error']['Message']}")

# Test 2: Get object
print("\n2. Testing s3:GetObject permission...")
try:
    # Try to get the first object
    response = s3.list_objects_v2(Bucket=BUCKET, Prefix='materials/', MaxKeys=1)
    if response.get('Contents'):
        test_key = response['Contents'][0]['Key']
        print(f"   Testing with key: {test_key}")
        
        obj = s3.get_object(Bucket=BUCKET, Key=test_key)
        print(f"   ✓ Can get object! Size: {obj['ContentLength']} bytes")
    else:
        print("   ⚠ No objects to test with")
except ClientError as e:
    print(f"   ✗ FAILED: {e.response['Error']['Code']} - {e.response['Error']['Message']}")

# Test 3: Generate presigned URL
print("\n3. Testing presigned URL generation...")
try:
    response = s3.list_objects_v2(Bucket=BUCKET, Prefix='materials/', MaxKeys=1)
    if response.get('Contents'):
        test_key = response['Contents'][0]['Key']
        print(f"   Testing with key: {test_key}")
        
        url = s3.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': BUCKET,
                'Key': test_key,
                'ResponseContentDisposition': f'attachment; filename="{test_key.split("/")[-1]}"'
            },
            ExpiresIn=3600
        )
        print(f"   ✓ Generated presigned URL")
        print(f"   URL: {url[:100]}...")
        
        # Test the URL
        import requests
        r = requests.get(url)
        print(f"   Testing URL: Status {r.status_code}")
        if r.status_code == 200:
            print(f"   ✓✓✓ PRESIGNED URL WORKS! Downloaded {len(r.content)} bytes")
        elif r.status_code == 403:
            print(f"   ✗✗✗ PRESIGNED URL RETURNS 403 FORBIDDEN")
            print(f"   Error: {r.text[:200]}")
        else:
            print(f"   ✗ Unexpected status: {r.status_code}")
    else:
        print("   ⚠ No objects to test with")
except Exception as e:
    print(f"   ✗ FAILED: {e}")

# Test 4: Put object
print("\n4. Testing s3:PutObject permission...")
try:
    test_content = b"Test file content from IAM permissions test"
    test_key = f"test-iam-permissions-{int(__import__('time').time())}.txt"
    
    s3.put_object(
        Bucket=BUCKET,
        Key=test_key,
        Body=test_content,
        ContentType='text/plain'
    )
    print(f"   ✓ Can upload object: {test_key}")
    
    # Clean up
    s3.delete_object(Bucket=BUCKET, Key=test_key)
    print(f"   ✓ Cleanup successful")
except ClientError as e:
    print(f"   ✗ FAILED: {e.response['Error']['Code']} - {e.response['Error']['Message']}")

print("\n" + "=" * 80)
print("REQUIRED IAM PERMISSIONS:")
print("=" * 80)
print("""
Your IAM user needs these permissions on the bucket:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::cpa-academy-media",
        "arn:aws:s3:::cpa-academy-media/*"
      ]
    }
  ]
}
""")
print("=" * 80)
