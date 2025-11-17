import boto3
import json

s3 = boto3.client(
    's3',
    region_name='us-east-1',
    aws_access_key_id='AKIA6QBBGIPUST32XDFC',
    aws_secret_access_key='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'
)

response = s3.get_bucket_policy(Bucket='cpa-academy-media')
policy = json.loads(response['Policy'])

print(json.dumps(policy, indent=2))
