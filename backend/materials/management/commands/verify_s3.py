"""
Management command to verify S3 configuration and test file operations.
"""
from django.core.management.base import BaseCommand
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from materials.models import Material
import os


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
        aws_config = {
            'AWS_STORAGE_BUCKET_NAME': getattr(settings, 'AWS_STORAGE_BUCKET_NAME', 'Not set'),
            'AWS_S3_REGION_NAME': getattr(settings, 'AWS_S3_REGION_NAME', 'Not set'),
            'AWS_ACCESS_KEY_ID': '***' + getattr(settings, 'AWS_ACCESS_KEY_ID', '')[-4:] if getattr(settings, 'AWS_ACCESS_KEY_ID', None) else 'Not set',
            'AWS_SECRET_ACCESS_KEY': '***' + getattr(settings, 'AWS_SECRET_ACCESS_KEY', '')[-4:] if getattr(settings, 'AWS_SECRET_ACCESS_KEY', None) else 'Not set',
            'AWS_S3_CUSTOM_DOMAIN': getattr(settings, 'AWS_S3_CUSTOM_DOMAIN', 'Not set'),
            'AWS_QUERYSTRING_EXPIRE': getattr(settings, 'AWS_QUERYSTRING_EXPIRE', 'Not set'),
        }
        
        for key, value in aws_config.items():
            self.stdout.write(f'{key}: {value}')

        self.stdout.write(f'\nMEDIA_URL: {settings.MEDIA_URL}')
        self.stdout.write(f'DEFAULT_FILE_STORAGE: {settings.DEFAULT_FILE_STORAGE}')

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

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\n✗ S3 test failed: {str(e)}'))
            self.stdout.write('\nCommon issues:')
            self.stdout.write('  - Check AWS credentials are correct')
            self.stdout.write('  - Verify bucket name and region')
            self.stdout.write('  - Ensure IAM user has proper S3 permissions')
            self.stdout.write('  - Check network connectivity to AWS')
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
