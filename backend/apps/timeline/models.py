"""
Timeline model for SETARA project.
Mendukung linimasa sejarah dan pencapaian platform.
"""

import uuid
from django.db import models
from django.utils import timezone


class Timeline(models.Model):
    """Model for timeline milestones."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tahun = models.CharField(max_length=20, blank=True, default='', help_text='Tahun milestone')
    tanggal = models.CharField(max_length=100, help_text='Label tanggal seperti "Maret 2024"')
    judul = models.CharField(max_length=255)
    deskripsi = models.TextField()
    kategori = models.CharField(max_length=100, blank=True, default='Pencapaian')
    icon = models.CharField(max_length=50, blank=True, default='Sparkles')
    gambar = models.ImageField(upload_to='timeline/', blank=True, null=True)
    gambar_url = models.URLField(max_length=500, blank=True, default='')
    urutan = models.PositiveIntegerField(default=0, help_text='Urutan tampilan')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'timelines'
        verbose_name = 'Timeline'
        verbose_name_plural = 'Timelines'
        ordering = ['urutan', 'created_at']

    def __str__(self):
        return f"{self.tahun} - {self.judul}"
