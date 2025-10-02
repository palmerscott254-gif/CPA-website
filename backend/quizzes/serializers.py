from rest_framework import serializers
from .models import QuestionSet, Question, QuizAttempt

class ChoiceSerializer(serializers.Serializer):
    id = serializers.CharField()
    text = serializers.CharField()

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ("id","text","choices","points","explanation")
        read_only_fields = ("explanation",)

class QuestionSetSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = QuestionSet
        fields = ("id","unit","title","description","questions")

class QuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = ("id","user","question_set","score","total","started_at","finished_at")
        read_only_fields = ("user","score","total","started_at","finished_at")
