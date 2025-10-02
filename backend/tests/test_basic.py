from django.test import TestCase
from django.urls import reverse
from users.models import User
from courses.models import Subject, Unit
from materials.models import Material
from quizzes.models import QuestionSet, Question
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile
import io

class BasicTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="test", password="pass1234")
        self.admin = User.objects.create_user(username="admin", password="adminpass", is_admin=True)
        self.subj = Subject.objects.create(name="Accounting")
        self.unit = Unit.objects.create(subject=self.subj, title="Financial Reporting 1")
        pdf_content = b"%PDF-1.4 test pdf"
        self.material = Material.objects.create(
            unit=self.unit,
            title="Unit 1 Notes",
            file=SimpleUploadedFile("unit1.pdf", pdf_content, content_type="application/pdf"),
            is_public=True
        )
        # Create question set
        self.qset = QuestionSet.objects.create(unit=self.unit, title="Unit 1 Revision")
        self.q1 = Question.objects.create(
            question_set=self.qset,
            text="2+2=?",
            choices=[{"id": "A", "text": "3"},{"id":"B","text":"4"}],
            correct_choice="B",
            points=1
        )

    def test_anonymous_can_view_unit(self):
        url = reverse("subjects_list")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)

    def test_download_increments_count(self):
        # login
        self.client.force_authenticate(user=self.user)
        url = reverse("material_download", args=[self.material.pk])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        self.material.refresh_from_db()
        self.assertEqual(self.material.download_count, 1)

    def test_quiz_scoring(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("quiz_attempt")
        payload = {
            "question_set": self.qset.id,
            "answers": [{"question_id": self.q1.id, "choice": "B"}]
        }
        resp = self.client.post(url, payload, format='json')
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.data["score"], 1)
        self.assertEqual(resp.data["total"], 1)
