from django.db import models
from django.conf import settings

class QuestionSet(models.Model):
    unit = models.ForeignKey("courses.Unit", on_delete=models.CASCADE, related_name="question_sets")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.title

class Question(models.Model):
    question_set = models.ForeignKey(QuestionSet, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()
    choices = models.JSONField()
    correct_choice = models.CharField(max_length=50)
    explanation = models.TextField(blank=True)
    points = models.IntegerField(default=1)

    def __str__(self):
        return f"Q: {self.text[:50]}"

class QuizAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="attempts")
    question_set = models.ForeignKey(QuestionSet, on_delete=models.CASCADE)
    score = models.IntegerField()
    total = models.IntegerField()
    started_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True, blank=True)
