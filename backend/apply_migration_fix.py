#!/usr/bin/env python
"""
Apply Migration Fix for CPA Academy
This script applies the missing file_type migration.
"""

import os
import sys
import logging
import django
from django.core.management import execute_from_command_line

# Configure module logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def setup_django():
    """Setup Django environment"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cpa_academy.settings')
    django.setup()

def apply_migration():
    """Apply the file_type migration"""
    logger.info("🔧 Applying file_type migration...")
    
    try:
        # Apply migrations
        execute_from_command_line(['manage.py', 'migrate', 'materials'])
    logger.info("✅ Migration applied successfully!")
        
        # Verify the migration was applied
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("PRAGMA table_info(materials_material)")
            columns = [row[1] for row in cursor.fetchall()]
            
            if 'file_type' in columns:
                logger.info("✅ file_type column confirmed in database!")
            else:
                logger.error("❌ file_type column not found!")
                return False
                
    except Exception as e:
        logger.error(f"❌ Error applying migration: {e}")
        return False
    
    return True

def test_admin():
    """Test admin functionality"""
    logger.info("🧪 Testing admin functionality...")
    
    try:
        from materials.models import Material
        from courses.models import Subject, Unit
        
        # Create test data if needed
        subject, created = Subject.objects.get_or_create(
            name="Test Subject",
            defaults={'slug': 'test-subject'}
        )
        
        unit, created = Unit.objects.get_or_create(
            subject=subject,
            title="Test Unit",
            defaults={'code': 'TEST001', 'description': 'Test unit for migration'}
        )
        
        # Test creating a material (without file)
        material = Material(
            unit=unit,
            title="Test Material",
            description="Test material for migration verification",
            file_type="pdf"  # This should work now
        )
        material.save()
        
    logger.info("✅ Material creation test passed!")
    logger.info(f"✅ Material ID: {material.id}")
    logger.info(f"✅ File type: {material.file_type}")
        
        # Clean up test data
        material.delete()
    logger.info("🧹 Test data cleaned up")
        
    except Exception as e:
        logger.error(f"❌ Error testing admin: {e}")
        return False
    
    return True

if __name__ == '__main__':
    setup_django()
    
    if apply_migration():
        if test_admin():
            logger.info("🎉 Migration fix completed successfully!")
            logger.info("✅ You can now use the admin panel to add materials")
        else:
            logger.warning("⚠️  Migration applied but admin test failed")
    else:
        logger.error("❌ Migration failed - please check the error above")
