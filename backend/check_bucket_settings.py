"""
Test S3 bucket public access settings.
"""
import boto3

s3 = boto3.client(
    's3',
    region_name='us-east-1',
    aws_access_key_id='AKIA6QBBGIPUST32XDFC',
    aws_secret_access_key='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'
)

BUCKET = 'cpa-academy-media'

print("Checking bucket public access block settings...")

try:
    response = s3.get_public_access_block(Bucket=BUCKET)
    config = response['PublicAccessBlockConfiguration']
    
    print(f"\nBucket: {BUCKET}")
    print(f"BlockPublicAcls: {config.get('BlockPublicAcls')}")
    print(f"IgnorePublicAcls: {config.get('IgnorePublicAcls')}")
    print(f"BlockPublicPolicy: {config.get('BlockPublicPolicy')}")
    print(f"RestrictPublicBuckets: {config.get('RestrictPublicBuckets')}")
    
    if config.get('RestrictPublicBuckets'):
        print("\n⚠ WARNING: RestrictPublicBuckets is TRUE")
        print("This might prevent presigned URLs from working!")
        
except Exception as e:
    if 'NoSuchPublicAccessBlockConfiguration' in str(e):
        print("✓ No public access block configured (presigned URLs should work)")
    else:
        print(f"Error: {e}")

print("\nChecking bucket policy...")
try:
    policy = s3.get_bucket_policy(Bucket=BUCKET)
    print(policy['Policy'])
except Exception as e:
    print(f"No bucket policy or error: {e}")
