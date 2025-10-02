from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import QuestionSet, Question, QuizAttempt
from .serializers import QuestionSetSerializer, QuizAttemptSerializer
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.utils import timezone

class QuestionSetDetailView(generics.RetrieveAPIView):
    queryset = QuestionSet.objects.all()
    serializer_class = QuestionSetSerializer
    permission_classes = [permissions.AllowAny]

class QuizAttemptCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Expects payload:
        {
            "question_set": <id>,
            "answers": [{"question_id": 1, "choice": "A"}, ...]
        }
        """
        data = request.data
        question_set_id = data.get("question_set")
        answers = data.get("answers", [])
        qset = get_object_or_404(QuestionSet, pk=question_set_id)
        total_possible = 0
        score = 0
        # Map questions for quick access
        qs = {q.id: q for q in qset.questions.all()}
        for q in qs.values():
            total_possible += q.points
        for ans in answers:
            qid = ans.get("question_id")
            choice = str(ans.get("choice"))
            q = qs.get(qid)
            if not q:
                continue
            if str(q.correct_choice) == choice:
                score += q.points
        attempt = QuizAttempt.objects.create(
            user=request.user,
            question_set=qset,
            score=score,
            total=total_possible,
            finished_at=timezone.now()
        )
        serializer = QuizAttemptSerializer(attempt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
