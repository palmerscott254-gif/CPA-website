"""
Apply a bucket policy that allows presigned URLs to work.
"""
import boto3
import json

s3 = boto3.client(
    's3',
    region_name='us-east-1',
    aws_access_key_id='AKIA6QBBGIPUST32XDFC',
    aws_secret_access_key='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'
)

# New policy that:
# 1. Requires HTTPS for all requests
# 2. Allows GetObject for presigned URLs (authenticated by signature)
new_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "RequireHTTPS",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::cpa-academy-media/*",
                "arn:aws:s3:::cpa-academy-media"
            ],
            "Condition": {
                "Bool": {
                    "aws:SecureTransport": "false"
                }
            }
        }
    ]
}

print("Current policy:")
try:
    current = s3.get_bucket_policy(Bucket='cpa-academy-media')
    print(json.dumps(json.loads(current['Policy']), indent=2))
except Exception as e:
    print(f"No policy: {e}")

print("\n" + "=" * 80)
print("New policy:")
print(json.dumps(new_policy, indent=2))

print("\n" + "=" * 80)
response = input("Apply this policy? (yes/no): ")

if response.lower() == 'yes':
    try:
        s3.put_bucket_policy(
            Bucket='cpa-academy-media',
            Policy=json.dumps(new_policy)
        )
        print("✓ Bucket policy updated!")
        
        # Test presigned URL again
        print("\nTesting presigned URL...")
        from botocore.client import Config
        import requests
        
        s3_v4 = boto3.client(
            's3',
            region_name='us-east-1',
            aws_access_key_id='AKIA6QBBGIPUST32XDFC',
            aws_secret_access_key='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',
            config=Config(signature_version='s3v4')
        )
        
        url = s3_v4.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': 'cpa-academy-media',
                'Key': 'materials/New_Financial_Accounting.pdf'
            },
            ExpiresIn=600
        )
        
        r = requests.head(url)
        print(f"Status: {r.status_code}")
        if r.status_code == 200:
            print("✓✓✓ SUCCESS! Downloads should work now!")
        else:
            print(f"✗ Still failing: {r.text[:200]}")
            
    except Exception as e:
        print(f"✗ Error: {e}")
else:
    print("Cancelled")
