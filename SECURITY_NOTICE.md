# 🚨 CRITICAL SECURITY NOTICE 🚨

## IMMEDIATE ACTION REQUIRED

**AWS credentials have been exposed in the GitHub issue and must be rotated immediately.**

### Exposed Credentials
The following AWS credentials were publicly posted and are now compromised:
- AWS Access Key ID: `AKIA6QBBGIPUST32XDFC`
- AWS Secret Access Key: (exposed)
- Bucket: `cpa-academy-media`
- Region: `us-east-1`

## Required Actions

### 1. **IMMEDIATELY Rotate AWS Credentials**

#### Step 1: Create New IAM User or Access Keys
1. Log into AWS Console: https://console.aws.amazon.com/
2. Navigate to IAM → Users
3. Either:
   - Create a new IAM user with S3 permissions, OR
   - Select existing user → Security Credentials → Delete the exposed access key → Create new access key

#### Step 2: Update Permissions
Ensure the new credentials have appropriate S3 permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
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
```

#### Step 3: Delete the Compromised Access Key
1. In AWS Console → IAM → Users → [Your User] → Security Credentials
2. Find the access key starting with `AKIA6QBBGIPUST32XDFC`
3. Click "Delete" and confirm

#### Step 4: Update Environment Variables
Update your environment with the NEW credentials:

**Local Development:**
```bash
# Create a .env file in the backend directory (NEVER commit this file)
echo "USE_S3=true" > backend/.env
echo "AWS_ACCESS_KEY_ID=YOUR_NEW_ACCESS_KEY" >> backend/.env
echo "AWS_SECRET_ACCESS_KEY=YOUR_NEW_SECRET_KEY" >> backend/.env
echo "AWS_STORAGE_BUCKET_NAME=cpa-academy-media" >> backend/.env
echo "AWS_S3_REGION_NAME=us-east-1" >> backend/.env
```

**Production (Render/Heroku/etc):**
Update environment variables in your hosting platform's dashboard.

### 2. **Audit AWS Account**

Check CloudTrail logs for any unauthorized access:
```bash
# Install AWS CLI if not already installed
pip install awscli

# Configure with your NEW credentials
aws configure

# Check recent S3 activity
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=ResourceType,AttributeValue=AWS::S3::Bucket \
  --max-results 50 \
  --region us-east-1
```

### 3. **Monitor for Abuse**

- Check S3 bucket for unauthorized uploads/deletions
- Review AWS billing for unexpected charges
- Enable S3 bucket logging
- Set up AWS CloudWatch alarms

### 4. **Review S3 Bucket Security**

Ensure your bucket has proper security settings:

```bash
# Check bucket public access settings
aws s3api get-public-access-block --bucket cpa-academy-media

# Ensure public access is blocked
aws s3api put-public-access-block \
  --bucket cpa-academy-media \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

## Prevention Measures

### Never Commit Secrets
- ✅ `.gitignore` includes `.env` and `.env.*` files
- ✅ Always use environment variables for sensitive data
- ✅ Use `.env.example` as a template (without actual secrets)

### Use Secret Scanning
Enable GitHub secret scanning:
1. Repository Settings → Security & Analysis
2. Enable "Secret scanning"
3. Enable "Push protection"

### Best Practices
1. **Never** post credentials in:
   - GitHub issues
   - Pull request descriptions
   - Code comments
   - Chat messages
   - Documentation
   
2. **Always** use environment variables for:
   - API keys
   - Database passwords
   - Secret keys
   - OAuth credentials
   
3. **Rotate credentials** regularly and immediately after exposure

4. **Use AWS Secrets Manager** or similar for production:
   ```python
   # Example: Fetch secrets from AWS Secrets Manager
   import boto3
   import json
   
   def get_secret(secret_name):
       client = boto3.client('secretsmanager', region_name='us-east-1')
       response = client.get_secret_value(SecretId=secret_name)
       return json.loads(response['SecretString'])
   ```

## Verification

After rotating credentials, verify the setup:

```bash
cd backend
python manage.py verify_s3
```

This will check:
- S3 connectivity
- Bucket access
- Upload/download permissions
- Configuration correctness

## Support Resources

- AWS IAM Best Practices: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
- AWS Security: https://aws.amazon.com/security/
- GitHub Secret Scanning: https://docs.github.com/en/code-security/secret-scanning

## Questions?

If you need help rotating credentials or have questions about this security issue, contact your team lead or AWS support immediately.

---

**Remember: Security is not optional. Rotate those credentials NOW!** 🔐
