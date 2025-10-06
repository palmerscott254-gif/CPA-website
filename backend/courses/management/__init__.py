from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from courses.models import Subject, Unit
from materials.models import Material
from quizzes.models import QuestionSet, Question
import os

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create a superuser if it doesn't exist
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@cpaacademy.com',
                password='admin123',
                first_name='Admin',
                last_name='User'
            )
            self.stdout.write('Created admin user (username: admin, password: admin123)')
        
        # Create sample subjects
        subjects_data = [
            {
                'name': 'Financial Accounting and Reporting (FAR)',
                'units': [
                    {'title': 'Conceptual Framework', 'code': 'FAR-001', 'description': 'Understanding the conceptual framework for financial reporting'},
                    {'title': 'Financial Statements', 'code': 'FAR-002', 'description': 'Preparation and presentation of financial statements'},
                    {'title': 'Revenue Recognition', 'code': 'FAR-003', 'description': 'Principles and standards for revenue recognition'},
                    {'title': 'Inventory Valuation', 'code': 'FAR-004', 'description': 'Methods and principles of inventory valuation'},
                ]
            },
            {
                'name': 'Auditing and Attestation (AUD)',
                'units': [
                    {'title': 'Audit Planning', 'code': 'AUD-001', 'description': 'Planning and preparation for audit engagements'},
                    {'title': 'Internal Controls', 'code': 'AUD-002', 'description': 'Evaluation and testing of internal controls'},
                    {'title': 'Audit Evidence', 'code': 'AUD-003', 'description': 'Types and evaluation of audit evidence'},
                    {'title': 'Audit Reports', 'code': 'AUD-004', 'description': 'Preparation and types of audit reports'},
                ]
            },
            {
                'name': 'Regulation (REG)',
                'units': [
                    {'title': 'Federal Taxation', 'code': 'REG-001', 'description': 'Individual and corporate federal taxation'},
                    {'title': 'Business Law', 'code': 'REG-002', 'description': 'Contracts, commercial law, and business structures'},
                    {'title': 'Ethics', 'code': 'REG-003', 'description': 'Professional ethics and responsibilities'},
                    {'title': 'Tax Planning', 'code': 'REG-004', 'description': 'Tax planning strategies and compliance'},
                ]
            },
            {
                'name': 'Business Environment and Concepts (BEC)',
                'units': [
                    {'title': 'Corporate Governance', 'code': 'BEC-001', 'description': 'Corporate governance and risk management'},
                    {'title': 'Economic Concepts', 'code': 'BEC-002', 'description': 'Economic principles and business cycles'},
                    {'title': 'Financial Management', 'code': 'BEC-003', 'description': 'Financial management and capital budgeting'},
                    {'title': 'Information Technology', 'code': 'BEC-004', 'description': 'IT systems and controls in business'},
                ]
            }
        ]
        
        for subject_data in subjects_data:
            subject, created = Subject.objects.get_or_create(
                name=subject_data['name'],
                defaults={'slug': subject_data['name'].lower().replace(' ', '-').replace('(', '').replace(')', '')}
            )
            
            if created:
                self.stdout.write(f'Created subject: {subject.name}')
            
            for unit_data in subject_data['units']:
                unit, created = Unit.objects.get_or_create(
                    subject=subject,
                    code=unit_data['code'],
                    defaults={
                        'title': unit_data['title'],
                        'description': unit_data['description'],
                        'order': len(subject.units.all()) + 1
                    }
                )
                
                if created:
                    self.stdout.write(f'Created unit: {unit.title}')
        
        # Create sample question sets
        sample_units = Unit.objects.all()[:4]  # Get first 4 units
        
        for i, unit in enumerate(sample_units):
            question_set, created = QuestionSet.objects.get_or_create(
                unit=unit,
                title=f'{unit.title} Practice Quiz',
                defaults={
                    'description': f'Practice questions for {unit.title}'
                }
            )
            
            if created:
                self.stdout.write(f'Created question set: {question_set.title}')
                
                # Create sample questions
                sample_questions = [
                    {
                        'text': f'What is the primary purpose of {unit.title.lower()}?',
                        'choices': ['A', 'B', 'C', 'D'],
                        'correct_choice': 'A',
                        'explanation': f'This is the correct answer for {unit.title}',
                        'points': 1
                    },
                    {
                        'text': f'Which principle is most important in {unit.title.lower()}?',
                        'choices': ['A', 'B', 'C', 'D'],
                        'correct_choice': 'B',
                        'explanation': f'This principle is fundamental to {unit.title}',
                        'points': 1
                    }
                ]
                
                for j, q_data in enumerate(sample_questions):
                    Question.objects.create(
                        question_set=question_set,
                        text=q_data['text'],
                        choices=q_data['choices'],
                        correct_choice=q_data['correct_choice'],
                        explanation=q_data['explanation'],
                        points=q_data['points']
                    )
        
        self.stdout.write(
            self.style.SUCCESS('Successfully populated database with sample data!')
        )
