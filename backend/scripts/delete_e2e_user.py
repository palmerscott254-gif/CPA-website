import os
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cpa_academy.settings')
import django
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

uname = 'e2e_20251109194221@example.com'

u = User.objects.filter(username=uname).first()
if not u:
    print('User not found:', uname)
    sys.exit(0)

u.delete()
print('Deleted user:', uname)
