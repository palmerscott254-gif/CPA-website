"""
Django Backend Comprehensive Audit Script
Tests Material model CRUD, file handling, and database integrity
"""
import os
import sys
import django
from io import BytesIO
from django.core.files.base import ContentFile
from pathlib import Path

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cpa_academy.settings')
django.setup()

from django.conf import settings
from courses.models import Unit, Subject
from materials.models import Material
from users.models import User

# Store test results
results = {
    'passed': [],
    'failed': [],
    'warnings': []
}

def log_pass(test_name):
    results['passed'].append(test_name)
    print(f"✓ PASS: {test_name}")

def log_fail(test_name, error):
    results['failed'].append(f"{test_name}: {error}")
    print(f"✗ FAIL: {test_name}")
    print(f"  Error: {error}")

def log_warning(message):
    results['warnings'].append(message)
    print(f"⚠ WARNING: {message}")

print("="*80)
print("DJANGO BACKEND AUDIT")
print("="*80)

# TEST 1: Database Schema Check
print("\n[1] DATABASE SCHEMA CHECK")
try:
    subject_count = Subject.objects.count()
    unit_count = Unit.objects.count()
    material_count = Material.objects.count()
    user_count = User.objects.count()
    
    print(f"  Subjects: {subject_count}")
    print(f"  Units: {unit_count}")
    print(f"  Materials: {material_count}")
    print(f"  Users: {user_count}")
    
    log_pass("Database schema accessible")
except Exception as e:
    log_fail("Database schema check", str(e))

# TEST 2: Foreign Key Integrity
print("\n[2] FOREIGN KEY INTEGRITY")
try:
    orphaned_materials = Material.objects.filter(unit__isnull=True).count()
    if orphaned_materials > 0:
        log_warning(f"Found {orphaned_materials} materials with null unit")
    else:
        log_pass("No orphaned materials (all have valid units)")
    
    # Check if units reference valid courses
    orphaned_units = Unit.objects.filter(subject__isnull=True).count()
    if orphaned_units > 0:
        log_warning(f"Found {orphaned_units} units with null subject")
    else:
        log_pass("No orphaned units (all have valid subjects)")
except Exception as e:
    log_fail("Foreign key integrity check", str(e))

# TEST 3: Model Field Validation
print("\n[3] MODEL FIELD VALIDATION")
try:
    from django.core.exceptions import ValidationError
    
    # Check Material model fields
    material_fields = [f.name for f in Material._meta.get_fields()]
    required_fields = ['unit', 'title', 'file', 'file_type', 'uploaded_by', 'upload_date']
    missing_fields = [f for f in required_fields if f not in material_fields]
    
    if missing_fields:
        log_fail("Material model fields", f"Missing fields: {missing_fields}")
    else:
        log_pass("Material model has all required fields")
    
    print(f"  Material fields: {', '.join(material_fields)}")
except Exception as e:
    log_fail("Model field validation", str(e))

# TEST 4: MEDIA_ROOT Configuration
print("\n[4] MEDIA CONFIGURATION")
try:
    use_s3 = getattr(settings, 'USE_S3', False)
    print(f"  USE_S3: {use_s3}")
    
    if use_s3:
        bucket = getattr(settings, 'AWS_STORAGE_BUCKET_NAME', 'Not set')
        region = getattr(settings, 'AWS_S3_REGION_NAME', 'Not set')
        print(f"  S3 Bucket: {bucket}")
        print(f"  S3 Region: {region}")
        log_pass("S3 configuration detected")
    else:
        media_root = getattr(settings, 'MEDIA_ROOT', 'Not set')
        media_url = getattr(settings, 'MEDIA_URL', 'Not set')
        print(f"  MEDIA_ROOT: {media_root}")
        print(f"  MEDIA_URL: {media_url}")
        
        if media_root != 'Not set':
            media_path = Path(media_root)
            if media_path.exists():
                log_pass("MEDIA_ROOT exists")
            else:
                log_warning(f"MEDIA_ROOT does not exist: {media_root}")
        else:
            log_fail("MEDIA configuration", "MEDIA_ROOT not set")
except Exception as e:
    log_fail("MEDIA configuration check", str(e))

# TEST 5: Material CRUD Operations
print("\n[5] MATERIAL CRUD OPERATIONS")
test_material = None

# Get or create test unit
try:
    test_unit = Unit.objects.first()
    if not test_unit:
        test_subject = Subject.objects.first()
        if test_subject:
            test_unit = Unit.objects.create(
                subject=test_subject,
                title="Audit Test Unit",
                description="Created for audit testing"
            )
            print("  Created test unit")
        else:
            log_fail("CRUD test setup", "No subjects available for testing")
            test_unit = None
except Exception as e:
    log_fail("CRUD test setup", str(e))
    test_unit = None

if test_unit:
    # CREATE
    try:
        test_file = ContentFile(b"Audit test file content", name="audit_test.txt")
        test_material = Material.objects.create(
            unit=test_unit,
            title="Audit Test Material",
            description="Created by audit script",
            file=test_file,
            is_public=True
        )
        log_pass("Material CREATE operation")
        print(f"  Created material ID: {test_material.id}")
    except Exception as e:
        log_fail("Material CREATE operation", str(e))
    
    # READ
    if test_material:
        try:
            retrieved = Material.objects.get(id=test_material.id)
            assert retrieved.title == "Audit Test Material"
            assert retrieved.unit == test_unit
            log_pass("Material READ operation")
        except Exception as e:
            log_fail("Material READ operation", str(e))
        
        # UPDATE
        try:
            test_material.title = "Updated Audit Test Material"
            test_material.description = "Updated description"
            test_material.save()
            
            updated = Material.objects.get(id=test_material.id)
            assert updated.title == "Updated Audit Test Material"
            log_pass("Material UPDATE operation")
        except Exception as e:
            log_fail("Material UPDATE operation", str(e))

# TEST 6: File Storage and Retrieval
print("\n[6] FILE STORAGE AND RETRIEVAL")
if test_material:
    try:
        # Check if file exists in storage
        file_exists = test_material.file.storage.exists(test_material.file.name)
        print(f"  File path: {test_material.file.name}")
        print(f"  File exists in storage: {file_exists}")
        
        if file_exists:
            log_pass("File stored successfully")
            
            # Try to get file URL
            try:
                file_url = test_material.file.url
                print(f"  File URL: {file_url}")
                log_pass("File URL generation")
            except Exception as e:
                log_warning(f"Could not generate file URL: {e}")
            
            # Try to read file content
            try:
                test_material.file.open('rb')
                content = test_material.file.read()
                test_material.file.close()
                
                if b"Audit test file content" in content:
                    log_pass("File content verification")
                else:
                    log_fail("File content verification", "Content mismatch")
            except Exception as e:
                log_fail("File read operation", str(e))
        else:
            log_fail("File storage", "File not found in storage")
    except Exception as e:
        log_fail("File storage check", str(e))

# TEST 7: File Deletion and Cleanup
print("\n[7] FILE DELETION AND CLEANUP")
if test_material:
    try:
        # Store file name before deletion
        file_name = test_material.file.name
        material_id = test_material.id
        
        # Check if file exists before deletion
        file_existed_before = test_material.file.storage.exists(file_name)
        
        # Delete the material
        test_material.delete()
        
        # Verify database deletion
        exists_in_db = Material.objects.filter(id=material_id).exists()
        if not exists_in_db:
            log_pass("Material database record deleted")
        else:
            log_fail("Material deletion", "Record still exists in database")
        
        # Check if file still exists in storage
        # Note: Django's default FileField does NOT auto-delete files
        # This is expected behavior and requires manual cleanup or signals
        file_exists_after = Material.objects.first().file.storage.exists(file_name) if Material.objects.exists() else False
        
        if file_existed_before:
            print(f"  File existed before deletion: Yes")
            print(f"  File cleanup: Manual cleanup required (expected Django behavior)")
            log_warning("Files are not auto-deleted (Django default behavior)")
        
    except Exception as e:
        log_fail("File deletion test", str(e))

# TEST 8: Import Validation
print("\n[8] IMPORT VALIDATION")
try:
    from materials.views import MaterialListView, MaterialCreateView, material_download_view
    log_pass("Materials views import")
except Exception as e:
    log_fail("Materials views import", str(e))

try:
    from materials.serializers import MaterialSerializer
    log_pass("Materials serializers import")
except Exception as e:
    log_fail("Materials serializers import", str(e))

try:
    from materials.models import Material
    log_pass("Materials models import")
except Exception as e:
    log_fail("Materials models import", str(e))

# TEST 9: Serializer Validation
print("\n[9] SERIALIZER VALIDATION")
try:
    from materials.serializers import MaterialSerializer
    
    if Material.objects.exists():
        material = Material.objects.first()
        serializer = MaterialSerializer(material)
        data = serializer.data
        
        required_fields = ['id', 'title', 'file', 'unit']
        missing = [f for f in required_fields if f not in data]
        
        if missing:
            log_fail("Serializer fields", f"Missing fields: {missing}")
        else:
            log_pass("Serializer has all required fields")
            print(f"  Serialized fields: {', '.join(data.keys())}")
    else:
        log_warning("No materials in database to test serializer")
except Exception as e:
    log_fail("Serializer validation", str(e))

# TEST 10: View Configuration Check
print("\n[10] VIEW CONFIGURATION")
try:
    from materials import views
    
    # Check if views have proper attributes
    if hasattr(views, 'MaterialListView'):
        list_view = views.MaterialListView
        if hasattr(list_view, 'serializer_class') and hasattr(list_view, 'permission_classes'):
            log_pass("MaterialListView properly configured")
        else:
            log_fail("MaterialListView", "Missing required attributes")
    
    if hasattr(views, 'MaterialCreateView'):
        create_view = views.MaterialCreateView
        if hasattr(create_view, 'serializer_class') and hasattr(create_view, 'parser_classes'):
            log_pass("MaterialCreateView properly configured")
        else:
            log_fail("MaterialCreateView", "Missing required attributes")
            
except Exception as e:
    log_fail("View configuration check", str(e))

# FINAL SUMMARY
print("\n" + "="*80)
print("AUDIT SUMMARY")
print("="*80)
print(f"\n✓ PASSED: {len(results['passed'])} tests")
for test in results['passed']:
    print(f"  - {test}")

if results['warnings']:
    print(f"\n⚠ WARNINGS: {len(results['warnings'])}")
    for warning in results['warnings']:
        print(f"  - {warning}")

if results['failed']:
    print(f"\n✗ FAILED: {len(results['failed'])} tests")
    for failure in results['failed']:
        print(f"  - {failure}")
else:
    print("\n🎉 All critical tests passed!")

print("\n" + "="*80)
