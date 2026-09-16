"""Admin configuration for Translator app."""
from django.contrib import admin
from apps.translator.models import TranslationHistory

@admin.register(TranslationHistory)
class TranslationHistoryAdmin(admin.ModelAdmin):
    list_display = ('tipe_translasi', 'tipe_bahasa', 'input_text', 'user', 'created_at')
    list_filter = ('tipe_translasi', 'tipe_bahasa')
    search_fields = ('input_text', 'output_text')
    readonly_fields = ('created_at',)
