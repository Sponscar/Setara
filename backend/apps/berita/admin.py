"""Admin configuration for Berita app."""
from django.contrib import admin
from apps.berita.models import Berita

@admin.register(Berita)
class BeritaAdmin(admin.ModelAdmin):
    list_display = ('judul', 'kategori', 'status', 'author', 'views', 'created_at')
    list_filter = ('kategori', 'status', 'is_deleted')
    search_fields = ('judul', 'konten')
    prepopulated_fields = {'slug': ('judul',)}
    readonly_fields = ('views', 'created_at', 'updated_at')
