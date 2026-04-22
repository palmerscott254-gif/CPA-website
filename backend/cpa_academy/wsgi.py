import os
import time
import logging
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cpa_academy.settings')

# Measure and log Django startup time to track cold start performance.
# getLogger is called after get_wsgi_application() so Django's logging
# configuration from settings.py is already active.
_startup_start = time.monotonic()
application = get_wsgi_application()
_startup_duration_ms = (time.monotonic() - _startup_start) * 1000

logging.getLogger(__name__).info(
    "Cold start: Django app loaded in %.0f ms", _startup_duration_ms
)
