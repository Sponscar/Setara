"""
Models for Komunitas app.
Mencakup:
1. Komunitas (Direktori Komunitas & Organisasi Tuli - Gerkatin, SLIC, dll)
2. KomunitasActivity (Event, Workshop, dll)
3. KomunitasMember (Keanggotaan user platform)
4. KomunitasTestimonial (Testimoni pengguna)
"""

import uuid
from django.db import models
from django.conf import settings

from shared.constants import KomunitasActivityType, MemberStatus


class Komunitas(models.Model):
    """Model untuk direktori komunitas / organisasi Tuli & isyarat."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nama = models.CharField(max_length=255)
    deskripsi = models.TextField(help_text='Deskripsi singkat')
    deskripsi_lengkap = models.TextField(blank=True, default='', help_text='Deskripsi detail')
    kategori = models.CharField(max_length=100, default='Organisasi Tuli')
    platform = models.CharField(max_length=50, default='Website')
    link = models.URLField(max_length=500, blank=True, default='')
    logo = models.ImageField(upload_to='komunitas/logos/', null=True, blank=True)
    logo_url = models.URLField(max_length=500, blank=True, default='')
    anggota = models.CharField(max_length=100, blank=True, default='')
    status = models.CharField(
        max_length=20,
        choices=MemberStatus.CHOICES,
        default='approved'
    )
    kontak = models.CharField(max_length=100, blank=True, default='')
    email_kontak = models.EmailField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'komunitas_direktori'
        verbose_name = 'Direktori Komunitas'
        verbose_name_plural = 'Direktori Komunitas'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.nama} ({self.status})"


class KomunitasActivity(models.Model):
    """Model untuk preview aktivitas komunitas."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    judul = models.CharField(max_length=255)
    deskripsi = models.TextField(blank=True, default='')
    tipe = models.CharField(
        max_length=20,
        choices=KomunitasActivityType.CHOICES,
        default=KomunitasActivityType.EVENT
    )
    tanggal_mulai = models.DateTimeField(null=True, blank=True)
    tanggal_selesai = models.DateTimeField(null=True, blank=True)
    lokasi = models.CharField(max_length=255, blank=True, default='')
    gambar = models.ImageField(upload_to='komunitas/activities/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'komunitas_activities'
        verbose_name = 'Aktivitas Komunitas'
        verbose_name_plural = 'Aktivitas Komunitas'
        ordering = ['-tanggal_mulai', '-created_at']

    def __str__(self):
        return self.judul


class KomunitasMember(models.Model):
    """Model untuk pendaftaran keanggotaan komunitas individual."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='komunitas_membership'
    )
    alasan_bergabung = models.TextField(blank=True, default='')
    status = models.CharField(
        max_length=20,
        choices=MemberStatus.CHOICES,
        default=MemberStatus.PENDING
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_komunitas_members'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'komunitas_members'
        verbose_name = 'Anggota Komunitas'
        verbose_name_plural = 'Anggota Komunitas'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.status}"


class KomunitasTestimonial(models.Model):
    """Model untuk testimonial pengguna SETARA."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='testimonials'
    )
    nama = models.CharField(max_length=255)
    peran = models.CharField(max_length=255, blank=True, default='Pengguna SETARA')
    avatar = models.ImageField(upload_to='komunitas/testimonials/', null=True, blank=True)
    avatar_url = models.URLField(max_length=500, blank=True, default='')
    konten = models.TextField()
    rating = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'komunitas_testimonials'
        verbose_name = 'Testimonial'
        verbose_name_plural = 'Testimonial'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.nama} ({self.rating}★)"
