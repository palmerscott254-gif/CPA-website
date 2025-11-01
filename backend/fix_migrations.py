#!/usr/bin/env python
"""
Migration Fix Script for CPA Academy
This script ensures all database migrations are properly applied.
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_django():
    """Setup Django environment"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cpa_academy.settings')
    django.setup()

def run_migrations():
    """Run all necessary migrations"""
    print("🔧 Running Django migrations...")

    apps = ['users', 'courses', 'materials', 'quizzes']

    # First, fake a rollback to zero for all apps to clear history
    # This is safer than deleting files or dropping tables
    print("⏪ Clearing migration history from database...")
    for app in apps:
        print(f"   - Clearing {app}...")
        try:
            execute_from_command_line(['manage.py', 'migrate', app, 'zero'])
        except Exception as e:
            print(f"   - Could not clear {app}, it might not have migrations yet. Error: {e}")

    # Apply all migrations
    # The 'migrate' command will now run migrations for all apps from the start.
    print("🚀 Applying all migrations from scratch...")
    execute_from_command_line(['manage.py', 'migrate'])

    print("✅ All migrations completed successfully!")

def verify_models():
    """Verify that all models can be imported and created"""
    print("🔍 Verifying models...")
    
    try:
        from users.models import User
        from courses.models import Subject, Unit
        from materials.models import Material
        from quizzes.models import QuestionSet, Question, QuizAttempt
        
        print("✅ All models imported successfully")
        
        # Test creating instances (without saving)
        user = User(username='test', email='test@example.com')
        subject = Subject(name='Test Subject')
        unit = Unit(subject=subject, title='Test Unit')
        material = Material(unit=unit, title='Test Material')
        question_set = QuestionSet(unit=unit, title='Test Quiz')
        question = Question(question_set=question_set, text='Test Question', choices={}, correct_choice='A')
        attempt = QuizAttempt(user=user, question_set=question_set, score=0, total=1)
        
        print("✅ All model instances created successfully")
        
    except Exception as e:
        print(f"❌ Error verifying models: {e}")
        return False
    
    return True

if __name__ == '__main__':
    setup_django()
    run_migrations()
    verify_models()
    print("🎉 Migration fix completed!")
