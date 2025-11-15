from django.urls import path
from .views import MaterialListView, MaterialCreateView, MaterialDetailView, material_download_view

urlpatterns = [
    path("", MaterialListView.as_view(), name="materials_list"),
    path("upload/", MaterialCreateView.as_view(), name="materials_upload"),
    path("<int:pk>/", MaterialDetailView.as_view(), name="material_detail"),
    path("<int:pk>/download/", material_download_view, name="material_download"),
    # Alternate route to be forgiving about URL structure used by clients
    path("download/<int:pk>/", material_download_view, name="material_download_alt"),
]
