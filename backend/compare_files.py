"""
Compare working file vs non-working file to find the difference.
"""
import boto3

s3 = boto3.client(
    's3',
    region_name='us-east-1',
    aws_access_key_id='AKIA6QBBGIPUST32XDFC',
    aws_secret_access_key='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'
)

BUCKET = 'cpa-academy-media'

# Working file (from earlier test)
working_key = 'materials/FAR_Study_Guide.pdf'

# Non-working file
broken_key = 'materials/New_Financial_Accounting.pdf'

print("=" * 80)
print("COMPARE WORKING VS NON-WORKING FILES")
print("=" * 80)

for key in [working_key, broken_key]:
    print(f"\n{key}:")
    print("-" * 80)
    
    try:
        # Get object metadata
        response = s3.head_object(Bucket=BUCKET, Key=key)
        
        print(f"✓ Object exists")
        print(f"  Size: {response['ContentLength']} bytes")
        print(f"  ContentType: {response.get('ContentType', 'N/A')}")
        print(f"  LastModified: {response.get('LastModified', 'N/A')}")
        print(f"  ETag: {response.get('ETag', 'N/A')}")
        print(f"  Metadata: {response.get('Metadata', {})}")
        
        # Check ACL
        try:
            acl = s3.get_object_acl(Bucket=BUCKET, Key=key)
            print(f"  ACL Owner: {acl['Owner']['DisplayName']}")
            print(f"  ACL Grants:")
            for grant in acl.get('Grants', []):
                grantee = grant['Grantee']
                permission = grant['Permission']
                if grantee['Type'] == 'CanonicalUser':
                    print(f"    - {grantee.get('DisplayName', 'Unknown')}: {permission}")
                elif grantee['Type'] == 'Group':
                    print(f"    - Group ({grantee.get('URI', 'Unknown')}): {permission}")
        except Exception as e:
            print(f"  ✗ Could not get ACL: {e}")
        
        # Try to download
        print(f"\n  Testing direct download...")
        try:
            obj = s3.get_object(Bucket=BUCKET, Key=key)
            print(f"  ✓ Direct download works! {obj['ContentLength']} bytes")
        except Exception as e:
            print(f"  ✗ Direct download failed: {e}")
        
        # Try presigned URL
        print(f"\n  Testing presigned URL...")
        try:
            from botocore.client import Config
            s3_v4 = boto3.client(
                's3',
                region_name='us-east-1',
                aws_access_key_id='AKIA6QBBGIPUST32XDFC',
                aws_secret_access_key='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',
                config=Config(signature_version='s3v4')
            )
            
            url = s3_v4.generate_presigned_url(
                'get_object',
                Params={'Bucket': BUCKET, 'Key': key},
                ExpiresIn=600
            )
            
            import requests
            r = requests.head(url)
            print(f"  Presigned URL status: {r.status_code}")
            if r.status_code != 200:
                print(f"  Response: {r.text[:200]}")
        except Exception as e:
            print(f"  ✗ Presigned URL failed: {e}")
            
    except Exception as e:
        print(f"✗ Error: {e}")

print("\n" + "=" * 80)
