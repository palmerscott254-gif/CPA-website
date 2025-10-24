#!/usr/bin/env python
"""
Migration Reset Script for CPA Academy
This script safely resets migrations and recreates them.
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_django():
    """Setup Django environment"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cpa_academy.settings')
    django.setup()

def reset_migrations():
    """Reset and recreate all migrations"""
    print("🔄 Resetting migrations...")
    
    # Remove migration files (except __init__.py)
    apps = ['users', 'courses', 'materials', 'quizzes']
    
    for app in apps:
        migrations_dir = f"{app}/migrations"
        if os.path.exists(migrations_dir):
            for file in os.listdir(migrations_dir):
                if file.endswith('.py') and file != '__init__.py':
                    file_path = os.path.join(migrations_dir, file)
                    os.remove(file_path)
                    print(f"🗑️  Removed {file_path}")
    
    # Create fresh migrations
    print("📝 Creating fresh migrations...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    
    # Apply migrations
    print("🚀 Applying fresh migrations...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    print("✅ Migration reset completed!")

if __name__ == '__main__':
    setup_django()
    reset_migrations()
    print("🎉 Migration reset completed!")
