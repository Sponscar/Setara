"""Apps configuration for Translator."""
from django.apps import AppConfig

class TranslatorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.translator'
    verbose_name = 'Translator'
