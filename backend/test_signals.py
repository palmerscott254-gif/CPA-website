"""
Test script to verify file deletion signals work correctly
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cpa_academy.settings')
django.setup()

from django.core.files.base import ContentFile
from materials.models import Material
from courses.models import Unit

print("="*80)
print("TESTING FILE DELETION SIGNALS")
print("="*80)

# Get a test unit
unit = Unit.objects.first()
if not unit:
    print("✗ No units available for testing")
    exit(1)

print("\n[TEST 1] File deletion when Material is deleted")
print("-" * 60)

# Create a material with a file
test_file = ContentFile(b"Signal test file content", name="signal_test_delete.txt")
material = Material.objects.create(
    unit=unit,
    title="Signal Test - Delete",
    description="Testing automatic file deletion",
    file=test_file
)

file_name = material.file.name
file_path = material.file.path if hasattr(material.file, 'path') else file_name
print(f"Created Material ID: {material.id}")
print(f"File: {file_name}")

# Check if file exists
file_exists_before = material.file.storage.exists(file_name)
print(f"File exists before deletion: {file_exists_before}")

# Delete the material
material.delete()
print(f"Material deleted")

# Check if file was also deleted
try:
    # We need to check with a new storage instance since material is deleted
    from materials.models import Material
    sample_material = Material.objects.first()
    if sample_material:
        storage = sample_material.file.storage
        file_exists_after = storage.exists(file_name)
        print(f"File exists after deletion: {file_exists_after}")
        
        if file_exists_after:
            print("✗ FAIL: File was NOT deleted (signal may not be working)")
        else:
            print("✓ PASS: File was automatically deleted by signal")
    else:
        print("⚠ Cannot verify (no materials in database)")
except Exception as e:
    print(f"✗ Error checking file deletion: {e}")

print("\n[TEST 2] Old file deletion when Material file is updated")
print("-" * 60)

# Create a material with a file
test_file1 = ContentFile(b"Original file content", name="signal_test_update_v1.txt")
material = Material.objects.create(
    unit=unit,
    title="Signal Test - Update",
    description="Testing old file deletion on update",
    file=test_file1
)

old_file_name = material.file.name
print(f"Created Material ID: {material.id}")
print(f"Original file: {old_file_name}")
print(f"File exists: {material.file.storage.exists(old_file_name)}")

# Update the material with a new file
test_file2 = ContentFile(b"Updated file content", name="signal_test_update_v2.txt")
material.file = test_file2
material.save()

new_file_name = material.file.name
print(f"\nUpdated material with new file: {new_file_name}")

# Check if old file was deleted
old_file_exists = material.file.storage.exists(old_file_name)
new_file_exists = material.file.storage.exists(new_file_name)

print(f"Old file exists: {old_file_exists}")
print(f"New file exists: {new_file_exists}")

if old_file_exists:
    print("✗ FAIL: Old file was NOT deleted (signal may not be working)")
else:
    print("✓ PASS: Old file was automatically deleted by signal")

if new_file_exists:
    print("✓ PASS: New file exists as expected")
else:
    print("✗ FAIL: New file does not exist")

# Clean up
print(f"\nCleaning up test material...")
material.delete()
print("✓ Cleanup complete")

print("\n" + "="*80)
print("SIGNAL TESTS COMPLETE")
print("="*80)
