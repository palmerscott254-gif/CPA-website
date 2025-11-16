# Quick Reference: S3 Configuration

## ⚡ Quick Start

### 1. Set Up Environment (Local Development)
```bash
# Navigate to backend
cd backend

# Copy environment template
cp ../.env.example .env

# Edit .env file with your credentials
# NOTE: NEVER commit the .env file!
```

### 2. Configure S3 (in .env file)
```bash
USE_S3=true
AWS_ACCESS_KEY_ID=your-new-access-key-here
AWS_SECRET_ACCESS_KEY=your-new-secret-key-here
AWS_STORAGE_BUCKET_NAME=cpa-academy-media
AWS_S3_REGION_NAME=us-east-1
```

### 3. Install Dependencies
```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Activate (Linux/Mac)
source .venv/bin/activate

# Install packages
pip install -r requirements.txt
```

### 4. Test S3 Connection
```bash
python manage.py verify_s3
```

Expected output:
```
✓ All S3 tests passed!
✓ Configuration looks good!
✓ S3 connectivity successful!
```

## 🚨 If Credentials Were Exposed

**DO THIS IMMEDIATELY:**

1. **Delete Exposed Key**
   - Go to: https://console.aws.amazon.com/iam
   - Users → [Your User] → Security Credentials
   - Find and DELETE the exposed access key

2. **Create New Key**
   - Click "Create access key"
   - Save the credentials securely
   - Update your `.env` file with NEW credentials

3. **Test New Credentials**
   ```bash
   python manage.py verify_s3
   ```

## 📋 Common Commands

### Run Django Server (Local)
```bash
cd backend
python manage.py runserver
```

### Run Django Server (with S3)
```bash
cd backend
# Set USE_S3=true in .env file first
python manage.py runserver
```

### Check S3 Configuration
```bash
cd backend
python manage.py verify_s3
```

### Upload Test File to S3
```bash
cd backend
python manage.py upload_pdf_to_s3
```

### Run Tests
```bash
cd backend
python manage.py test -v 2
```

## 🔍 Troubleshooting

### "No module named 'django'"
```bash
# Install requirements
pip install -r requirements.txt
```

### "403 Forbidden" when accessing S3
- Check IAM user has proper S3 permissions
- Verify bucket policy allows access
- Ensure credentials are correct

### "Bucket does not exist"
- Verify bucket name in `.env` matches actual bucket
- Check region is correct
- Ensure bucket exists in AWS console

### CORS errors in browser
- Check S3 bucket CORS configuration
- Add your frontend domain to AllowedOrigins
- See `backend/S3_CORS_CONFIG.json` for template

## 📁 Important Files

| File | Purpose | Commit? |
|------|---------|---------|
| `.env.example` | Template with no secrets | ✅ Yes |
| `backend/.env` | YOUR credentials | ❌ NO! |
| `SECURITY_NOTICE.md` | Security alert & steps | ✅ Yes |
| `S3_SETUP_GUIDE.md` | Full setup instructions | ✅ Yes |
| `SECURITY_SUMMARY.md` | Executive summary | ✅ Yes |

## 🔐 Security Checklist

- [ ] Credentials in `.env` file (not in code)
- [ ] `.env` is in `.gitignore`
- [ ] Never committed `.env` to git
- [ ] Rotated credentials after exposure
- [ ] Deleted old/exposed credentials
- [ ] S3 bucket public access blocked
- [ ] IAM user has least privilege permissions
- [ ] Enabled S3 encryption
- [ ] Reviewed CloudTrail logs

## 🆘 Need Help?

1. **Security Issues**: See `SECURITY_NOTICE.md`
2. **S3 Setup**: See `S3_SETUP_GUIDE.md`
3. **General Setup**: See `backend/README.md`
4. **Environment Variables**: See `.env.example`

## 💡 Pro Tips

- Use `USE_S3=false` for local development (faster)
- Use `USE_S3=true` for production-like testing
- Never expose credentials in issues/PRs/commits
- Rotate credentials every 90 days
- Enable CloudTrail for audit logging
- Use AWS Secrets Manager in production

---

**Remember**: Keep credentials secure! 🔐
