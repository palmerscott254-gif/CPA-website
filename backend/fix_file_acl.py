"""
Fix ACL on the problematic file.
"""
import boto3

s3 = boto3.client(
    's3',
    region_name='us-east-1',
    aws_access_key_id='AKIA6QBBGIPUST32XDFC',
    aws_secret_access_key='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'
)

BUCKET = 'cpa-academy-media'
KEY = 'materials/New_Financial_Accounting.pdf'

print(f"Fixing ACL on: {KEY}")

try:
    # Copy object to itself to reset ACL (keeps all metadata)
    s3.copy_object(
        Bucket=BUCKET,
        Key=KEY,
        CopySource={'Bucket': BUCKET, 'Key': KEY},
        ACL='private',  # Set to private (presigned URLs will still work)
        MetadataDirective='COPY'
    )
    print("✓ ACL updated")
    
    # Test presigned URL
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
        Params={'Bucket': BUCKET, 'Key': KEY},
        ExpiresIn=600
    )
    
    r = requests.head(url)
    print(f"\nPresigned URL test: {r.status_code}")
    if r.status_code == 200:
        print("✓✓✓ SUCCESS! Presigned URLs now work!")
    else:
        print("✗ Still failing")
        
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
