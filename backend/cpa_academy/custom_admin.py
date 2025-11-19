from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from users.models import User
from courses.models import Subject, Unit
from materials.models import Material
from quizzes.models import QuestionSet, Question, QuizAttempt

# Customize Django admin site headers and titles
admin.site.site_header = "CPA Web Administration"
admin.site.site_title = "CPA Web Admin Portal"
admin.site.index_title = "Welcome to CPA Web Control Panel"

# Unregister allauth's User admin if it exists
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

# Register models for admin interface
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_admin', 'is_staff', 'last_login', 'date_joined')
    list_filter = ('is_admin', 'is_staff', 'is_superuser', 'is_active', 'date_joined', 'last_login')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    # Add is_admin to the fieldsets
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('is_admin',)}),
    )
    
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['total_users'] = User.objects.count()
        extra_context['users_logged_in'] = User.objects.filter(last_login__isnull=False).count()
        return super().changelist_view(request, extra_context=extra_context)

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'code', 'order')
    list_filter = ('subject',)
    search_fields = ('title', 'code', 'description')
    ordering = ('subject', 'order')

@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ('title', 'unit', 'file_type', 'uploaded_by', 'upload_date', 'download_count', 'is_public')
    list_filter = ('is_public', 'file_type', 'upload_date', 'unit__subject')
    search_fields = ('title', 'description')
    ordering = ('-upload_date',)

@admin.register(QuestionSet)
class QuestionSetAdmin(admin.ModelAdmin):
    list_display = ('title', 'unit', 'question_count')
    list_filter = ('unit__subject',)
    search_fields = ('title', 'description')
    
    def question_count(self, obj):
        return obj.questions.count()
    question_count.short_description = 'Questions'

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text_preview', 'question_set', 'points', 'correct_choice')
    list_filter = ('question_set__unit__subject', 'points')
    search_fields = ('text',)
    
    def text_preview(self, obj):
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_preview.short_description = 'Question'

@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'question_set', 'score', 'total', 'started_at', 'finished_at')
    list_filter = ('question_set__unit__subject', 'started_at')
    search_fields = ('user__username', 'question_set__title')
    ordering = ('-started_at',)
