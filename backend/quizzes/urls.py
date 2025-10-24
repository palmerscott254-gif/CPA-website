from django.urls import path
from .views import QuestionSetListView, QuestionSetDetailView, QuizAttemptCreateView, QuizRootView

urlpatterns = [
    path("", QuizRootView.as_view(), name="quiz_root"),
    path("sets/", QuestionSetListView.as_view(), name="questionset_list"),
    path("sets/<int:pk>/", QuestionSetDetailView.as_view(), name="questionset_detail"),
    path("attempts/", QuizAttemptCreateView.as_view(), name="quiz_attempt"),
]
