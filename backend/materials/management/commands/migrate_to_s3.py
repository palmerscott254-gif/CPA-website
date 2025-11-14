"""
Management command to migrate existing media files from local storage to S3.
Run this after enabling S3 to move all existing files to the cloud.
"""
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.conf import settings
from materials.models import Material
import os


class Command(BaseCommand):
    help = 'Migrate existing media files from local storage to S3'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be migrated without actually doing it',
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force re-upload even if file already exists in S3',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        force = options['force']

        if not getattr(settings, 'USE_S3', False):
            self.stdout.write(
                self.style.WARNING(
                    'S3 is not enabled. Set USE_S3=True in your environment to use this command.'
                )
            )
            return

        self.stdout.write(self.style.SUCCESS('Starting migration to S3...'))
        
        materials = Material.objects.all()
        total = materials.count()
        migrated = 0
        skipped = 0
        errors = 0

        for i, material in enumerate(materials, 1):
            self.stdout.write(f'Processing {i}/{total}: {material.title}')
            
            if not material.file:
                self.stdout.write(self.style.WARNING(f'  ⚠ No file attached, skipping'))
                skipped += 1
                continue

            try:
                # Check if file exists locally
                try:
                    file_path = material.file.path
                    if not os.path.exists(file_path):
                        self.stdout.write(self.style.WARNING(f'  ⚠ Local file not found: {file_path}'))
                        skipped += 1
                        continue
                except (ValueError, NotImplementedError):
                    # File is already on S3 or using non-local storage
                    if not force:
                        self.stdout.write(self.style.WARNING(f'  ⚠ Already on S3, skipping (use --force to re-upload)'))
                        skipped += 1
                        continue
                    else:
                        self.stdout.write(self.style.WARNING(f'  ⚠ Cannot access local file, skipping'))
                        skipped += 1
                        continue

                if dry_run:
                    self.stdout.write(self.style.SUCCESS(f'  ✓ Would migrate: {file_path}'))
                    migrated += 1
                else:
                    # Read the local file
                    with open(file_path, 'rb') as f:
                        file_content = f.read()
                    
                    # Get the original filename
                    original_name = os.path.basename(material.file.name)
                    
                    # Save to S3 (this will use the S3 storage backend)
                    material.file.save(original_name, ContentFile(file_content), save=True)
                    
                    self.stdout.write(self.style.SUCCESS(f'  ✓ Migrated: {original_name}'))
                    migrated += 1

            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  ✗ Error: {str(e)}'))
                errors += 1

        # Summary
        self.stdout.write('\n' + '='*50)
        if dry_run:
            self.stdout.write(self.style.SUCCESS(f'DRY RUN COMPLETE'))
            self.stdout.write(f'Would migrate: {migrated}')
        else:
            self.stdout.write(self.style.SUCCESS(f'MIGRATION COMPLETE'))
            self.stdout.write(f'Migrated: {migrated}')
        
        self.stdout.write(f'Skipped: {skipped}')
        self.stdout.write(f'Errors: {errors}')
        self.stdout.write(f'Total: {total}')
        
        if not dry_run and migrated > 0:
            self.stdout.write('\n' + self.style.SUCCESS(
                'Files have been uploaded to S3. You can now safely delete local files if needed.'
            ))
