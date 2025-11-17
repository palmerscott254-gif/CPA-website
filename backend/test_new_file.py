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
        'Key': 'materials/New_Financial_Accounting.pdf'
    },
    ExpiresIn=600
)

print(f'Testing: materials/New_Financial_Accounting.pdf')
print(f'URL: {url[:100]}...')

r = requests.head(url)
print(f'Status: {r.status_code}')

if r.status_code == 200:
    print(f'✓✓✓ SUCCESS!')
    print(f'Content-Length: {r.headers.get("Content-Length")}')
    print(f'Content-Type: {r.headers.get("Content-Type")}')
else:
    print(f'✗ FAILED')
    print(r.text[:500])
