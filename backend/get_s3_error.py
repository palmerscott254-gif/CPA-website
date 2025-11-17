"""
Get detailed error from S3 presigned URL.
"""
import boto3
from botocore.client import Config
import requests

s3 = boto3.client(
    's3',
    region_name='us-east-1',
    aws_access_key_id='AKIA6QBBGIPUST32XDFC',
    aws_secret_access_key='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',
    config=Config(signature_version='s3v4')
)

url = s3.generate_presigned_url(
    'get_object',
    Params={
        'Bucket': 'cpa-academy-media',
        'Key': 'materials/FAR_Study_Guide.pdf'
    },
    ExpiresIn=600
)

print("Testing presigned URL:")
print(url)
print()

r = requests.get(url)
print(f"Status: {r.status_code}")
print(f"Response:")
print(r.text)
