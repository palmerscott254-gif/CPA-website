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
    
    # Make migrations for all apps
    apps = ['users', 'courses', 'materials', 'quizzes']
    
    for app in apps:
        print(f"📝 Making migrations for {app}...")
        execute_from_command_line(['manage.py', 'makemigrations', app])
    
    # Apply all migrations
    print("🚀 Applying migrations...")
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
