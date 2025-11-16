# CPA Backend

This Django backend is configured for local development (filesystem) and production (AWS S3) media storage via `django-storages`. Secrets and deployment variables are read from environment variables.

⚠️ **SECURITY**: Never commit credentials to version control. See `../SECURITY_NOTICE.md` for security best practices.

📖 **Documentation**: 
- See `../.env.example` for required environment variables template
- See `../S3_SETUP_GUIDE.md` for comprehensive S3 configuration instructions

## Quick start

1) Create and activate a virtualenv, then install deps:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt
```

2) Local dev run (uses local filesystem media):

```powershell
$env:DJANGO_DEBUG="True"
$env:USE_S3="false"
python manage.py migrate
python manage.py runserver
```

3) Enable S3 (production-like):

**Important**: Create a `.env` file in the backend directory (it's already in .gitignore):

```bash
# Create .env file from template
cp ../.env.example .env
# Edit .env with your actual credentials (NEVER commit this file!)
```

Then set environment variables or use the .env file:

```powershell
$env:DJANGO_DEBUG="False"
$env:USE_S3="true"
$env:AWS_ACCESS_KEY_ID="your-aws-access-key"
$env:AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
$env:AWS_STORAGE_BUCKET_NAME="cpa-academy-media"
$env:AWS_S3_REGION_NAME="us-east-1"
$env:DJANGO_SECRET_KEY="your-random-long-secret"
python manage.py collectstatic --noinput
python manage.py migrate
python manage.py runserver
```

4) Verify S3 configuration and connectivity:

```bash
python manage.py verify_s3
```

This will test:
- Environment variables are set correctly
- S3 bucket is accessible
- File upload/download works
- Presigned URL generation works

Alternatively, check storage via the API:

- Open `GET /api/health/storage/` to check current storage backend and media URL.

## Running tests

```powershell
python manage.py test -v 2
```

## Notes

- **NEVER commit real secrets.** Use environment variables only.
- Keep your `.env` file local and never commit it (it's in `.gitignore`).
- Use `../.env.example` as a template for required environment variables.
- For S3 setup, see the comprehensive guide: `../S3_SETUP_GUIDE.md`
- For security best practices, see: `../SECURITY_NOTICE.md`
- In production (`cpa_academy/production.py`), S3 is forced on and Postgres is expected.

## Security

🔐 **Important Security Practices:**

1. **Never hardcode credentials** - Always use environment variables
2. **Rotate credentials regularly** - Especially after exposure
3. **Use least privilege** - IAM users should only have required S3 permissions
4. **Enable encryption** - Use S3 bucket encryption and HTTPS only
5. **Monitor access** - Enable CloudTrail and S3 access logging

If credentials are ever exposed:
1. Follow the immediate action steps in `../SECURITY_NOTICE.md`
2. Rotate credentials immediately
3. Audit AWS account for unauthorized access
4. Update all environments with new credentials
