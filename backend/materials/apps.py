from django.apps import AppConfig


class MaterialsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'materials'
    
    def ready(self):
        """Import signal handlers when the app is ready"""
        import materials.signals  # noqa
