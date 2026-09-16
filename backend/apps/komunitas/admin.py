"""Admin configuration for Komunitas app."""
from django.contrib import admin
from apps.komunitas.models import Komunitas, KomunitasActivity, KomunitasMember, KomunitasTestimonial


@admin.register(Komunitas)
class KomunitasAdmin(admin.ModelAdmin):
    list_display = ('nama', 'platform', 'kategori', 'status', 'kontak', 'created_at')
    list_filter = ('platform', 'status', 'kategori')
    search_fields = ('nama', 'deskripsi', 'kontak', 'email_kontak')


@admin.register(KomunitasActivity)
class KomunitasActivityAdmin(admin.ModelAdmin):
    list_display = ('judul', 'tipe', 'tanggal_mulai', 'lokasi', 'is_active', 'created_at')
    list_filter = ('tipe', 'is_active')
    search_fields = ('judul', 'deskripsi', 'lokasi')


@admin.register(KomunitasMember)
class KomunitasMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'approved_at', 'approved_by', 'created_at')
    list_filter = ('status',)
    search_fields = ('user__email', 'user__full_name', 'alasan_bergabung')


@admin.register(KomunitasTestimonial)
class KomunitasTestimonialAdmin(admin.ModelAdmin):
    list_display = ('nama', 'peran', 'rating', 'is_active', 'created_at')
    list_filter = ('rating', 'is_active')
    search_fields = ('nama', 'konten')
