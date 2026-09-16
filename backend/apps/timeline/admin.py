"""Admin configuration for Timeline app."""
from django.contrib import admin
from apps.timeline.models import Timeline

@admin.register(Timeline)
class TimelineAdmin(admin.ModelAdmin):
    list_display = ('judul', 'tanggal', 'urutan', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('judul', 'deskripsi')
