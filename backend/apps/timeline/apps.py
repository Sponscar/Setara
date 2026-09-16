"""Apps configuration for Timeline."""
from django.apps import AppConfig

class TimelineConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.timeline'
    verbose_name = 'Timeline'
