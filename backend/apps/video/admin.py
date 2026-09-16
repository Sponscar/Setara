"""Admin configuration for Video app."""
from django.contrib import admin
from apps.video.models import Video

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('kata', 'tipe_bahasa', 'durasi', 'status', 'created_at')
    list_filter = ('tipe_bahasa', 'status')
    search_fields = ('kata', 'tag')
