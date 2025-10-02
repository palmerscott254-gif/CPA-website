from django.urls import path
from .views import SubjectListView, UnitListView

urlpatterns = [
    path("", SubjectListView.as_view(), name="subjects_list"),
    path("units/", UnitListView.as_view(), name="units_list"),
]
