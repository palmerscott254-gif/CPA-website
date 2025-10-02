from django.urls import path
from .views import QuestionSetDetailView, QuizAttemptCreateView

urlpatterns = [
    path("sets/<int:pk>/", QuestionSetDetailView.as_view(), name="questionset_detail"),
    path("attempts/", QuizAttemptCreateView.as_view(), name="quiz_attempt"),
]
