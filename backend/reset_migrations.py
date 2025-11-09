#!/usr/bin/env python
"""
Migration Reset Script for CPA Academy
This script safely resets migrations and recreates them.
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

def reset_migrations():
    """Reset and recreate all migrations"""
    logger.info("🔄 Resetting migrations...")
    
    # Remove migration files (except __init__.py)
    apps = ['users', 'courses', 'materials', 'quizzes']
    
    for app in apps:
        migrations_dir = f"{app}/migrations"
        if os.path.exists(migrations_dir):
            for file in os.listdir(migrations_dir):
                if file.endswith('.py') and file != '__init__.py':
                    file_path = os.path.join(migrations_dir, file)
                    os.remove(file_path)
                    logger.info(f"🗑️  Removed {file_path}")
    
    # Create fresh migrations
    logger.info("📝 Creating fresh migrations...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    
    # Apply migrations
    logger.info("🚀 Applying fresh migrations...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    logger.info("✅ Migration reset completed!")

if __name__ == '__main__':
    setup_django()
    reset_migrations()
    logger.info("🎉 Migration reset completed!")
