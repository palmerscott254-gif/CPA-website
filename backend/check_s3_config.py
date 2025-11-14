"""
S3 Configuration and Connectivity Diagnostic Script

This script checks:
1. Django S3 settings configuration
2. AWS credentials availability
3. S3 bucket connectivity
4. Presigned URL generation capability
5. File existence in S3

Usage:
    cd backend
    python check_s3_config.py
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cpa_academy.settings')
django.setup()

from django.conf import settings
import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from materials.models import Material

def check_s3_configuration():
    """Check Django S3 configuration."""
    print("\n" + "="*60)
    print("S3 CONFIGURATION CHECK")
    print("="*60 + "\n")
    
    # Check USE_S3 setting
    use_s3 = getattr(settings, 'USE_S3', False)
    print(f"1. USE_S3: {use_s3}")
    
    if not use_s3:
        print("   ⚠ WARNING: S3 is not enabled. Set USE_S3=True in environment.")
        return False
    
    # Check AWS credentials
    aws_access_key = getattr(settings, 'AWS_ACCESS_KEY_ID', None)
    aws_secret_key = getattr(settings, 'AWS_SECRET_ACCESS_KEY', None)
    aws_bucket = getattr(settings, 'AWS_STORAGE_BUCKET_NAME', None)
    aws_region = getattr(settings, 'AWS_S3_REGION_NAME', 'us-east-1')
    
    print(f"2. AWS_ACCESS_KEY_ID: {'✓ Set' if aws_access_key else '✗ Missing'}")
    print(f"3. AWS_SECRET_ACCESS_KEY: {'✓ Set' if aws_secret_key else '✗ Missing'}")
    print(f"4. AWS_STORAGE_BUCKET_NAME: {aws_bucket or '✗ Missing'}")
    print(f"5. AWS_S3_REGION_NAME: {aws_region}")
    
    # Check storage backend
    default_storage = getattr(settings, 'DEFAULT_FILE_STORAGE', None)
    print(f"6. DEFAULT_FILE_STORAGE: {default_storage}")
    
    if not all([aws_access_key, aws_secret_key, aws_bucket]):
        print("\n✗ CRITICAL: Missing AWS credentials or bucket name")
        print("  Set these environment variables:")
        print("    - AWS_ACCESS_KEY_ID")
        print("    - AWS_SECRET_ACCESS_KEY")
        print("    - AWS_STORAGE_BUCKET_NAME")
        return False
    
    print("\n✓ Configuration looks good!")
    return True


def check_s3_connectivity():
    """Test S3 bucket connectivity."""
    print("\n" + "="*60)
    print("S3 CONNECTIVITY CHECK")
    print("="*60 + "\n")
    
    try:
        aws_access_key = settings.AWS_ACCESS_KEY_ID
        aws_secret_key = settings.AWS_SECRET_ACCESS_KEY
        aws_bucket = settings.AWS_STORAGE_BUCKET_NAME
        aws_region = settings.AWS_S3_REGION_NAME
        
        # Create S3 client
        s3_client = boto3.client(
            's3',
            region_name=aws_region,
            aws_access_key_id=aws_access_key,
            aws_secret_access_key=aws_secret_key
        )
        
        print("1. Testing S3 connection...")
        
        # Test bucket access
        try:
            response = s3_client.head_bucket(Bucket=aws_bucket)
            print(f"   ✓ Successfully connected to bucket: {aws_bucket}")
            print(f"   Region: {aws_region}")
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == '404':
                print(f"   ✗ Bucket '{aws_bucket}' does not exist")
            elif error_code == '403':
                print(f"   ✗ Access denied to bucket '{aws_bucket}'")
            else:
                print(f"   ✗ Error accessing bucket: {e}")
            return False
        
        # List some objects
        print("\n2. Listing objects in bucket...")
        try:
            response = s3_client.list_objects_v2(
                Bucket=aws_bucket,
                Prefix='materials/',
                MaxKeys=5
            )
            
            if 'Contents' in response:
                print(f"   Found {response.get('KeyCount', 0)} objects (showing max 5):")
                for obj in response['Contents'][:5]:
                    print(f"     - {obj['Key']} ({obj['Size']} bytes)")
            else:
                print("   No objects found in materials/ prefix")
        except ClientError as e:
            print(f"   ✗ Error listing objects: {e}")
            return False
        
        print("\n✓ S3 connectivity successful!")
        return True
        
    except NoCredentialsError:
        print("✗ No AWS credentials found")
        return False
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return False


def check_presigned_url_generation():
    """Test presigned URL generation."""
    print("\n" + "="*60)
    print("PRESIGNED URL GENERATION CHECK")
    print("="*60 + "\n")
    
    try:
        # Get a material with a file
        material = Material.objects.filter(file__isnull=False).exclude(file='').first()
        
        if not material:
            print("⚠ No materials with files found in database")
            return False
        
        print(f"Testing with material: {material.title} (ID: {material.id})")
        print(f"File path: {material.file.name}\n")
        
        # Method 1: Using storage backend
        print("1. Testing storage.url() method...")
        try:
            storage = material.file.storage
            filename = os.path.basename(material.file.name)
            
            signed_url = storage.url(
                material.file.name,
                parameters={'ResponseContentDisposition': f'attachment; filename="{filename}"'},
                expire=3600,
            )
            
            print(f"   ✓ Generated URL (first 100 chars):")
            print(f"     {signed_url[:100]}...")
            
            # Check if URL contains expected components
            if aws_bucket := getattr(settings, 'AWS_STORAGE_BUCKET_NAME', None):
                if aws_bucket in signed_url:
                    print(f"   ✓ URL contains bucket name")
                if 'X-Amz-Algorithm' in signed_url:
                    print(f"   ✓ URL is properly signed")
                if 'X-Amz-Expires' in signed_url:
                    print(f"   ✓ URL has expiration")
            
        except Exception as e:
            print(f"   ✗ storage.url() failed: {e}")
            print("   Trying fallback method...")
            
            # Method 2: Using boto3 directly
            print("\n2. Testing boto3 client method...")
            try:
                s3_client = boto3.client(
                    's3',
                    region_name=settings.AWS_S3_REGION_NAME,
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
                )
                
                filename = os.path.basename(material.file.name)
                
                presigned_url = s3_client.generate_presigned_url(
                    'get_object',
                    Params={
                        'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                        'Key': material.file.name,
                        'ResponseContentDisposition': f'attachment; filename="{filename}"'
                    },
                    ExpiresIn=3600
                )
                
                print(f"   ✓ Generated URL (first 100 chars):")
                print(f"     {presigned_url[:100]}...")
                
            except Exception as e2:
                print(f"   ✗ boto3 method also failed: {e2}")
                return False
        
        print("\n✓ Presigned URL generation successful!")
        return True
        
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all diagnostic checks."""
    print("\n" + "╔" + "="*58 + "╗")
    print("║" + " "*15 + "S3 DIAGNOSTIC TOOL" + " "*25 + "║")
    print("╚" + "="*58 + "╝")
    
    results = []
    
    # Run checks
    results.append(("Configuration", check_s3_configuration()))
    
    if results[-1][1]:  # Only proceed if configuration is valid
        results.append(("Connectivity", check_s3_connectivity()))
        results.append(("Presigned URL", check_presigned_url_generation()))
    
    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    for name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"  {name:20} {status}")
    
    print("\nDatabase Statistics:")
    print(f"  Total Materials: {Material.objects.count()}")
    print(f"  With files: {Material.objects.exclude(file='').count()}")
    print(f"  Without files: {Material.objects.filter(file='').count()}")
    
    print("\n" + "="*60 + "\n")
    
    if all(result[1] for result in results):
        print("✓ All checks passed! S3 integration is working correctly.\n")
        return 0
    else:
        print("✗ Some checks failed. Please review the errors above.\n")
        return 1


if __name__ == '__main__':
    sys.exit(main())
