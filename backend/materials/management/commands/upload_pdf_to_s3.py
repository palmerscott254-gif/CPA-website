"""
Management command to perform an end-to-end upload of a small PDF to the
configured default storage (S3 when USE_S3=True), then validate the object's
existence using boto3 head_object. Cleans up by default.

Usage:
  python manage.py upload_pdf_to_s3 [--keep]

Behavior:
  - Requires USE_S3=True and AWS env vars set
  - Creates Subject/Unit if missing
  - Uploads a small generated PDF as a Material.file
  - Validates object via boto3 head_object
  - Deletes Material and S3 object unless --keep is specified
"""
import io
import uuid
from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.files.base import ContentFile
from django.db import transaction

from courses.models import Subject, Unit
from materials.models import Material


class Command(BaseCommand):
    help = "Upload a test PDF as a Material to S3 and validate with head_object"

    def add_arguments(self, parser):
        parser.add_argument("--keep", action="store_true", help="Keep the created Material and object; do not delete")

    def handle(self, *args, **options):
        use_s3 = getattr(settings, "USE_S3", False)
        if not use_s3:
            self.stdout.write(self.style.ERROR("USE_S3 is False. Set USE_S3=True and AWS_* env vars, then retry."))
            self._print_env_tips()
            return

        required = [
            "AWS_ACCESS_KEY_ID",
            "AWS_SECRET_ACCESS_KEY",
            "AWS_STORAGE_BUCKET_NAME",
            "AWS_S3_REGION_NAME",
        ]
        missing = [k for k in required if not getattr(settings, k, None)]
        if missing:
            self.stdout.write(self.style.ERROR(f"Missing required settings: {', '.join(missing)}"))
            self._print_env_tips()
            return

        bucket = settings.AWS_STORAGE_BUCKET_NAME
        region = settings.AWS_S3_REGION_NAME

        # Generate a tiny valid-ish PDF bytes buffer
        pdf_bytes = self._make_minimal_pdf()
        filename = f"materials/test-upload-{uuid.uuid4().hex}.pdf"

        # Ensure minimal course structure
        with transaction.atomic():
            subject, _ = Subject.objects.get_or_create(name="Test Subject", defaults={"slug": "test-subject"})
            unit, _ = Unit.objects.get_or_create(subject=subject, title="Test Unit")

            material = Material(
                unit=unit,
                title="S3 Upload Test PDF",
                description="Auto-generated test PDF for S3 verification",
                is_public=True,
            )
            material.file.save(filename, ContentFile(pdf_bytes), save=True)

        key = material.file.name
        url = None
        try:
            url = material.file.url
        except Exception:
            pass

        self.stdout.write(self.style.SUCCESS("Uploaded Material:"))
        self.stdout.write(f"  id: {material.id}")
        self.stdout.write(f"  key: {key}")
        if url:
            self.stdout.write(f"  url: {url}")

        # Validate with boto3 head_object
        try:
            import boto3
            s3_client = boto3.client(
                "s3",
                region_name=region,
                aws_access_key_id=getattr(settings, "AWS_ACCESS_KEY_ID", None),
                aws_secret_access_key=getattr(settings, "AWS_SECRET_ACCESS_KEY", None),
            )
            s3_client.head_object(Bucket=bucket, Key=key)
            self.stdout.write(self.style.SUCCESS("head_object OK: object exists in S3"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"head_object failed: {e}"))
            return

        if not options.get("keep"):
            # Cleanup both DB/material and S3 object
            try:
                # Deleting the model should delete the file via signals
                mid = material.id
                material.delete()
                self.stdout.write(self.style.SUCCESS(f"Deleted Material {mid} and attempted file cleanup"))
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Material delete warning: {e}"))
        else:
            self.stdout.write(self.style.WARNING("--keep specified: material and S3 object retained"))

        self.stdout.write(self.style.SUCCESS("Upload + validation completed."))
        return

    def _print_env_tips(self):
        self.stdout.write("Set environment variables, for example (PowerShell):")
        self.stdout.write("  $env:USE_S3=\"True\"")
        self.stdout.write("  $env:AWS_ACCESS_KEY_ID=\"<key>\"")
        self.stdout.write("  $env:AWS_SECRET_ACCESS_KEY=\"<secret>\"")
        self.stdout.write("  $env:AWS_STORAGE_BUCKET_NAME=\"<bucket>\"")
        self.stdout.write("  $env:AWS_S3_REGION_NAME=\"us-east-1\"")

    def _make_minimal_pdf(self) -> bytes:
        # A tiny minimal PDF file content
        # Not a full spec-compliant content stream, but adequate for storage testing
        content = (
            b"%PDF-1.4\n"
            b"1 0 obj<<>>endobj\n"
            b"2 0 obj<< /Length 0 >>stream\nendstream\nendobj\n"
            b"3 0 obj<< /Type /Page /Parent 4 0 R /MediaBox [0 0 200 200] >>endobj\n"
            b"4 0 obj<< /Type /Pages /Count 1 /Kids [3 0 R] >>endobj\n"
            b"5 0 obj<< /Type /Catalog /Pages 4 0 R >>endobj\n"
            b"xref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000050 00000 n \n0000000100 00000 n \n0000000170 00000 n \n0000000230 00000 n \n"
            b"trailer<< /Size 6 /Root 5 0 R >>\nstartxref\n290\n%%EOF\n"
        )
        return content
