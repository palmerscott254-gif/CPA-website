# S3 Storage Configuration Guide

This document explains how to configure AWS S3 storage for the CPA Academy Django backend.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [AWS Setup](#aws-setup)
4. [Django Configuration](#django-configuration)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

## Overview

The Django backend uses AWS S3 for media file storage (uploaded PDFs, images, etc.) in production. This provides:
- Scalable storage
- High availability
- CDN integration capability
- Secure file access with presigned URLs

### Storage Modes

- **Development** (`USE_S3=false`): Files stored locally in `backend/media/`
- **Production** (`USE_S3=true`): Files stored in AWS S3 bucket

## Prerequisites

- AWS Account
- AWS IAM permissions to create users and S3 buckets
- Django backend installed and configured

## AWS Setup

### Step 1: Create S3 Bucket

1. Log into [AWS Console](https://console.aws.amazon.com/)
2. Navigate to S3 service
3. Click "Create bucket"
4. Configure:
   - **Bucket name**: `cpa-academy-media` (or your preferred name)
   - **Region**: `us-east-1` (or your preferred region)
   - **Block Public Access**: Enable all (recommended for security)
   - **Versioning**: Optional (recommended for backup)
   - **Encryption**: Enable (recommended)

### Step 2: Configure CORS

S3 needs CORS configuration to allow frontend access:

1. Go to bucket → Permissions → CORS
2. Add this configuration (also in `backend/S3_CORS_CONFIG.json`):

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "HEAD", "PUT", "POST", "DELETE"],
        "AllowedOrigins": [
            "http://localhost:3000",
            "https://your-frontend-domain.com"
        ],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3600
    }
]
```

### Step 3: Create IAM User

1. Navigate to IAM → Users → Create User
2. User name: `cpa-academy-s3-user`
3. Access type: Programmatic access
4. Attach policy (create custom policy):

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
                "s3:ListBucket",
                "s3:PutObjectAcl"
            ],
            "Resource": [
                "arn:aws:s3:::cpa-academy-media",
                "arn:aws:s3:::cpa-academy-media/*"
            ]
        }
    ]
}
```

5. **Save the Access Key ID and Secret Access Key** (shown only once!)

### Step 4: Configure Bucket Policy (Optional)

For additional security, set a bucket policy (in `backend/S3_BUCKET_POLICY.json`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowS3UserAccess",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:user/cpa-academy-s3-user"
            },
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::cpa-academy-media",
                "arn:aws:s3:::cpa-academy-media/*"
            ]
        }
    ]
}
```

## Django Configuration

### Environment Variables

The Django backend is already configured to use environment variables for S3. You just need to set them.

#### Local Development

Create a `.env` file in the `backend/` directory:

```bash
# Enable S3 storage
USE_S3=true

# AWS Credentials
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_STORAGE_BUCKET_NAME=cpa-academy-media
AWS_S3_REGION_NAME=us-east-1

# Optional: CloudFront CDN domain
# AWS_S3_CUSTOM_DOMAIN=d123456.cloudfront.net
```

**Important**: 
- Never commit the `.env` file to git
- The `.env` file is already in `.gitignore`
- Use `.env.example` as a template

#### Production (Render, Heroku, etc.)

Set environment variables in your hosting platform:

**Render:**
1. Dashboard → Your Service → Environment
2. Add environment variables:
   - `USE_S3=true`
   - `AWS_ACCESS_KEY_ID=your-key`
   - `AWS_SECRET_ACCESS_KEY=your-secret`
   - `AWS_STORAGE_BUCKET_NAME=cpa-academy-media`
   - `AWS_S3_REGION_NAME=us-east-1`

**Heroku:**
```bash
heroku config:set USE_S3=true
heroku config:set AWS_ACCESS_KEY_ID=your-key
heroku config:set AWS_SECRET_ACCESS_KEY=your-secret
heroku config:set AWS_STORAGE_BUCKET_NAME=cpa-academy-media
heroku config:set AWS_S3_REGION_NAME=us-east-1
```

### How It Works

The settings are configured in `backend/cpa_academy/settings.py`:

```python
USE_S3 = os.getenv("USE_S3", "").lower() == "true"

if USE_S3:
    # AWS S3 Settings
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME", "cpa-academy-media")
    AWS_S3_REGION_NAME = os.getenv("AWS_S3_REGION_NAME", "us-east-1")
    
    # Use S3 for media files
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    
    # Media URL
    MEDIA_URL = f"https://{AWS_STORAGE_BUCKET_NAME}.s3.{AWS_S3_REGION_NAME}.amazonaws.com/"
else:
    # Local storage
    MEDIA_URL = "/media/"
    MEDIA_ROOT = os.path.join(BASE_DIR, "media")
```

### Features Enabled

- **Presigned URLs**: Files are accessed via temporary signed URLs for security
- **Private by default**: `AWS_DEFAULT_ACL = None` means files are private
- **No overwrites**: `AWS_S3_FILE_OVERWRITE = False` keeps file versions
- **Caching**: Files cached for 24 hours (`max-age=86400`)

## Testing

### Verify Configuration

Run the S3 verification script:

```bash
cd backend
python manage.py verify_s3
```

This checks:
- ✓ S3 is enabled
- ✓ Credentials are set
- ✓ Bucket is accessible
- ✓ Can upload/download files
- ✓ Can generate presigned URLs

### Upload Test File

Use the upload command to test:

```bash
cd backend
python manage.py upload_pdf_to_s3
```

This will:
1. Create a test PDF file
2. Upload it to S3
3. Verify the upload
4. Generate a presigned URL
5. Clean up the test file

### Manual Testing via Django Admin

1. Start the Django server:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. Access admin: http://localhost:8000/admin/

3. Go to Materials → Add Material

4. Upload a PDF file

5. Check S3 bucket to verify upload

### Check S3 Directly

Using AWS CLI:

```bash
# List bucket contents
aws s3 ls s3://cpa-academy-media/

# Check specific file
aws s3 ls s3://cpa-academy-media/materials/

# Download a file
aws s3 cp s3://cpa-academy-media/materials/test.pdf ./test.pdf
```

## Troubleshooting

### Common Issues

#### 1. "403 Forbidden" Error

**Cause**: IAM user doesn't have proper permissions

**Solution**:
- Check IAM policy includes `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`
- Verify bucket policy doesn't block access
- Ensure bucket public access settings allow IAM access

#### 2. "NoSuchBucket" Error

**Cause**: Bucket doesn't exist or wrong region

**Solution**:
- Verify bucket name matches `AWS_STORAGE_BUCKET_NAME`
- Check bucket exists in specified region
- Ensure region matches `AWS_S3_REGION_NAME`

#### 3. CORS Errors in Browser

**Cause**: CORS not configured or frontend domain not allowed

**Solution**:
- Add CORS configuration to S3 bucket
- Include your frontend domain in `AllowedOrigins`
- Clear browser cache

#### 4. "Credentials not found" Error

**Cause**: Environment variables not set

**Solution**:
```bash
# Check if variables are set
echo $USE_S3
echo $AWS_ACCESS_KEY_ID

# Set them if missing (see configuration section above)
```

#### 5. Files Upload but Can't Access

**Cause**: Presigned URLs not enabled or bucket policy too restrictive

**Solution**:
- Verify `AWS_QUERYSTRING_AUTH = True` in settings
- Check bucket policy allows GetObject
- Ensure IAM user can generate presigned URLs

### Debug Checklist

```bash
# 1. Check environment variables
python manage.py shell
>>> import os
>>> print("USE_S3:", os.getenv("USE_S3"))
>>> print("Bucket:", os.getenv("AWS_STORAGE_BUCKET_NAME"))
>>> print("Key ID:", os.getenv("AWS_ACCESS_KEY_ID")[:10] + "...")

# 2. Test boto3 connection
>>> import boto3
>>> s3 = boto3.client('s3',
...     aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
...     aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
...     region_name=os.getenv("AWS_S3_REGION_NAME")
... )
>>> s3.list_buckets()

# 3. Test file upload
>>> s3.put_object(Bucket='cpa-academy-media', Key='test.txt', Body=b'test')

# 4. Verify settings
>>> from django.conf import settings
>>> print("Storage:", settings.DEFAULT_FILE_STORAGE)
>>> print("Media URL:", settings.MEDIA_URL)
```

### Logs and Monitoring

Enable Django logging for storage operations:

```python
# Add to settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'storages': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

## Security Best Practices

1. **Never commit credentials**
   - Use environment variables
   - Keep `.env` in `.gitignore`
   - Use `.env.example` for templates

2. **Rotate credentials regularly**
   - Create new IAM access keys periodically
   - Delete old keys after rotation

3. **Use least privilege**
   - IAM user should only have S3 permissions
   - Only for specific bucket

4. **Enable encryption**
   - Enable S3 bucket encryption
   - Use HTTPS only

5. **Monitor access**
   - Enable S3 access logging
   - Set up CloudWatch alarms
   - Review CloudTrail logs

6. **Use CloudFront CDN** (optional but recommended)
   - Faster file delivery
   - Additional security layer
   - Cost optimization

## Additional Resources

- [Django Storages Documentation](https://django-storages.readthedocs.io/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Boto3 Documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Run `python manage.py verify_s3` for diagnostics
3. Review Django logs
4. Check AWS CloudTrail for API errors
5. Consult AWS Support or team lead

---

**Remember**: Keep credentials secure and never commit them to version control! 🔐
