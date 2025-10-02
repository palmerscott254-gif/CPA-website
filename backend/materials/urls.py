from django.urls import path
from .views import MaterialListView, MaterialCreateView, material_download_view

urlpatterns = [
    path("", MaterialListView.as_view(), name="materials_list"),
    path("upload/", MaterialCreateView.as_view(), name="materials_upload"),
    path("<int:pk>/download/", material_download_view, name="material_download"),
]
