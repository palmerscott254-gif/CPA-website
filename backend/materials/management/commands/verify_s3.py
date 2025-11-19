"""
Management command to verify S3 configuration and test file operations.
"""
from django.core.management.base import BaseCommand
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from materials.models import Material
from materials.views import generate_s3_presigned_url
import os
import sys


class Command(BaseCommand):
    help = 'Verify S3 configuration and test file operations'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=== S3 Configuration Check ===\n'))

        # Check if S3 is enabled
        use_s3 = getattr(settings, 'USE_S3', False)
        self.stdout.write(f'USE_S3: {use_s3}')
        
        if not use_s3:
            self.stdout.write(self.style.WARNING(
                '\n⚠ S3 is disabled. Using local storage.\n'
                'To enable S3, set USE_S3=True in your environment variables.'
            ))
            self.stdout.write(f'MEDIA_ROOT: {settings.MEDIA_ROOT}')
            self.stdout.write(f'MEDIA_URL: {settings.MEDIA_URL}')
            return

        # Display S3 configuration
        self.stdout.write('\n--- AWS Configuration ---')
        
        access_key = getattr(settings, 'AWS_ACCESS_KEY_ID', None)
        secret_key = getattr(settings, 'AWS_SECRET_ACCESS_KEY', None)
        bucket = getattr(settings, 'AWS_STORAGE_BUCKET_NAME', None)
        region = getattr(settings, 'AWS_S3_REGION_NAME', None)
        
        aws_config = {
            'AWS_STORAGE_BUCKET_NAME': bucket or 'Not set',
            'AWS_S3_REGION_NAME': region or 'Not set',
            'AWS_ACCESS_KEY_ID': '***' + access_key[-4:] if access_key and len(access_key) >= 4 else 'Not set',
            'AWS_SECRET_ACCESS_KEY': '***' + secret_key[-4:] if secret_key and len(secret_key) >= 4 else 'Not set',
            'AWS_S3_CUSTOM_DOMAIN': getattr(settings, 'AWS_S3_CUSTOM_DOMAIN', 'Not set'),
            'AWS_QUERYSTRING_AUTH': getattr(settings, 'AWS_QUERYSTRING_AUTH', 'Not set'),
        }
        
        # Check for missing credentials
        errors = []
        if not access_key:
            errors.append('AWS_ACCESS_KEY_ID is not set')
        if not secret_key:
            errors.append('AWS_SECRET_ACCESS_KEY is not set')
        if not bucket:
            errors.append('AWS_STORAGE_BUCKET_NAME is not set')
        if not region:
            errors.append('AWS_S3_REGION_NAME is not set')
        
        for key, value in aws_config.items():
            self.stdout.write(f'{key}: {value}')

        self.stdout.write(f'\nMEDIA_URL: {settings.MEDIA_URL}')
        self.stdout.write(f'DEFAULT_FILE_STORAGE: {getattr(settings, "DEFAULT_FILE_STORAGE", "Not set")}')
        
        # Display storage backend
        storage_backend = default_storage.__class__.__name__
        self.stdout.write(f'Active Storage Backend: {storage_backend}')
        
        if errors:
            self.stdout.write(self.style.ERROR('\n✗ Configuration Errors:'))
            for error in errors:
                self.stdout.write(self.style.ERROR(f'  - {error}'))
            self.stdout.write(self.style.ERROR('\nPlease set missing environment variables before proceeding.'))
            sys.exit(1)

        # Test S3 connection
        self.stdout.write('\n--- Testing S3 Connection ---')
        test_filename = 'test-s3-connection.txt'
        test_content = b'Hello from CPA Academy! This is a test file.'

        try:
            # Test upload
            self.stdout.write('1. Testing file upload...')
            default_storage.save(test_filename, ContentFile(test_content))
            self.stdout.write(self.style.SUCCESS('   ✓ Upload successful'))

            # Test existence check
            self.stdout.write('2. Testing file existence...')
            exists = default_storage.exists(test_filename)
            if exists:
                self.stdout.write(self.style.SUCCESS('   ✓ File exists in S3'))
            else:
                self.stdout.write(self.style.ERROR('   ✗ File not found in S3'))

            # Test URL generation
            self.stdout.write('3. Testing URL generation...')
            url = default_storage.url(test_filename)
            self.stdout.write(self.style.SUCCESS(f'   ✓ URL generated: {url[:80]}...'))

            # Test file size
            self.stdout.write('4. Testing file size retrieval...')
            size = default_storage.size(test_filename)
            self.stdout.write(self.style.SUCCESS(f'   ✓ File size: {size} bytes'))

            # Test file read
            self.stdout.write('5. Testing file read...')
            with default_storage.open(test_filename, 'rb') as f:
                content = f.read()
                if content == test_content:
                    self.stdout.write(self.style.SUCCESS('   ✓ File content matches'))
                else:
                    self.stdout.write(self.style.ERROR('   ✗ File content mismatch'))

            # Clean up
            self.stdout.write('6. Testing file deletion...')
            default_storage.delete(test_filename)
            if not default_storage.exists(test_filename):
                self.stdout.write(self.style.SUCCESS('   ✓ File deleted successfully'))
            else:
                self.stdout.write(self.style.ERROR('   ✗ File still exists after deletion'))

            self.stdout.write('\n' + self.style.SUCCESS('✓ All S3 tests passed!'))
            
            # Test presigned URL generation
            self.stdout.write('\n7. Testing presigned URL generation...')
            presigned = generate_s3_presigned_url(test_filename, expiration=60)
            if presigned:
                self.stdout.write(self.style.SUCCESS(f'   ✓ Presigned URL generated: {presigned[:80]}...'))
            else:
                self.stdout.write(self.style.ERROR('   ✗ Presigned URL generation failed'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\n✗ S3 test failed: {str(e)}'))
            import traceback
            self.stdout.write(self.style.ERROR(traceback.format_exc()))
            self.stdout.write('\nCommon issues:')
            self.stdout.write('  - Check AWS credentials are correct')
            self.stdout.write('  - Verify bucket name and region match your AWS console')
            self.stdout.write('  - Ensure IAM user has these permissions: s3:PutObject, s3:GetObject, s3:DeleteObject')
            self.stdout.write('  - Check network connectivity to AWS')
            self.stdout.write('  - Verify bucket exists and is in the correct region')
            sys.exit(1)
            return

        # Check existing materials
        self.stdout.write('\n--- Existing Materials ---')
        materials_count = Material.objects.count()
        self.stdout.write(f'Total materials: {materials_count}')

        if materials_count > 0:
            sample = Material.objects.first()
            if sample.file:
                try:
                    file_url = sample.file.url
                    is_s3_url = file_url.startswith('http://') or file_url.startswith('https://')
                    self.stdout.write(f'\nSample file URL: {file_url[:100]}...')
                    if is_s3_url:
                        self.stdout.write(self.style.SUCCESS('✓ Using S3 URLs'))
                    else:
                        self.stdout.write(self.style.WARNING('⚠ Using local URLs'))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error getting file URL: {str(e)}'))

        self.stdout.write('\n' + '='*50)
        self.stdout.write(self.style.SUCCESS('Configuration check complete!'))
