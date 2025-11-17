import boto3

s3 = boto3.client(
    's3',
    region_name='us-east-1',
    aws_access_key_id='AKIA6QBBGIPUST32XDFC',
    aws_secret_access_key='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'
)

print("Listing objects in cpa-academy-media bucket...\n")

# Check materials/ prefix
response = s3.list_objects_v2(Bucket='cpa-academy-media', Prefix='materials/')
if 'Contents' in response:
    print(f"Found {len(response['Contents'])} objects in materials/:")
    for obj in response['Contents'][:20]:
        print(f"  - {obj['Key']} ({obj['Size']} bytes)")
else:
    print("No objects found in materials/ prefix")

print("\n" + "="*60)

# Check root of bucket
response2 = s3.list_objects_v2(Bucket='cpa-academy-media', MaxKeys=20)
if 'Contents' in response2:
    print(f"\nFirst 20 objects in bucket root:")
    for obj in response2['Contents']:
        print(f"  - {obj['Key']} ({obj['Size']} bytes)")
else:
    print("\nBucket is empty")
