# CPA Backend

This Django backend is configured for local development (filesystem) and production (AWS S3) media storage via `django-storages`. Secrets and deployment variables are read from environment variables. See `.env.example` for required keys.

## Quick start

1) Create and activate a virtualenv, then install deps:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt
```

2) Local dev run (uses local filesystem media):

```powershell
$env:DJANGO_DEBUG="True"; $env:USE_S3="False"; python manage.py migrate; python manage.py runserver
```

3) Enable S3 (production-like):

```powershell
$env:DJANGO_DEBUG="False"
$env:USE_S3="True"
$env:AWS_ACCESS_KEY_ID="<key>"
$env:AWS_SECRET_ACCESS_KEY="<secret>"
$env:AWS_STORAGE_BUCKET_NAME="<bucket>"
$env:AWS_S3_REGION_NAME="us-east-1"
$env:DJANGO_SECRET_KEY="<random-long-secret>"
python manage.py collectstatic --noinput
python manage.py migrate
python manage.py runserver
```

4) Verify storage health:

- Open `GET /api/health/storage/` to check current storage backend and media URL.

## Running tests

```powershell
python manage.py test -v 2
```

## Notes

- Do not commit real secrets. Use environment variables only.
- In production (`cpa_academy/production.py`), S3 is forced on and Postgres is expected.
