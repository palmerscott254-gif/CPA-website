#!/usr/bin/env python
"""
Direct SQL Fix for CPA Academy
This script directly adds the file_type column to the database.
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_django():
    """Setup Django environment"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cpa_academy.settings')
    django.setup()

def direct_sql_fix():
    """Directly add the file_type column using SQL"""
    print("🔧 Applying direct SQL fix...")
    
    try:
        from django.db import connection
        
        with connection.cursor() as cursor:
            # Check if column already exists
            cursor.execute("PRAGMA table_info(materials_material)")
            columns = [row[1] for row in cursor.fetchall()]
            
            if 'file_type' in columns:
                print("✅ file_type column already exists!")
                return True
            
            # Add the file_type column
            print("📝 Adding file_type column...")
            cursor.execute("ALTER TABLE materials_material ADD COLUMN file_type VARCHAR(10) DEFAULT ''")
            
            # Verify the column was added
            cursor.execute("PRAGMA table_info(materials_material)")
            columns = [row[1] for row in cursor.fetchall()]
            
            if 'file_type' in columns:
                print("✅ file_type column added successfully!")
                return True
            else:
                print("❌ Failed to add file_type column!")
                return False
                
    except Exception as e:
        print(f"❌ Error applying SQL fix: {e}")
        return False

def test_fix():
    """Test that the fix works"""
    print("🧪 Testing the fix...")
    
    try:
        from materials.models import Material
        from courses.models import Subject, Unit
        
        # Get or create test data
        subject, created = Subject.objects.get_or_create(
            name="Test Subject",
            defaults={'slug': 'test-subject'}
        )
        
        unit, created = Unit.objects.get_or_create(
            subject=subject,
            title="Test Unit",
            defaults={'code': 'TEST001', 'description': 'Test unit'}
        )
        
        # Test creating a material
        material = Material(
            unit=unit,
            title="Test Material",
            description="Test material",
            file_type="pdf"
        )
        material.save()
        
        print("✅ Material creation successful!")
        print(f"✅ Material ID: {material.id}")
        print(f"✅ File type: {material.file_type}")
        
        # Clean up
        material.delete()
        print("🧹 Test data cleaned up")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing fix: {e}")
        return False

if __name__ == '__main__':
    setup_django()
    
    if direct_sql_fix():
        if test_fix():
            print("🎉 Direct SQL fix completed successfully!")
            print("✅ You can now use the admin panel to add materials")
        else:
            print("⚠️  SQL fix applied but test failed")
    else:
        print("❌ SQL fix failed - please check the error above")
