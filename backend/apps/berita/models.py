"""
Berita (News) model for SETARA project.
CRUD berita sesuai PRD Section 5 & Frontend News Tab.
"""

import uuid
from django.db import models
from django.utils.text import slugify

from shared.constants import BeritaKategori, BeritaStatus


class Berita(models.Model):
    """Model for news/articles about sign language."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    judul = models.CharField(max_length=255)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    ringkasan = models.TextField(blank=True, default='', help_text='Ringkasan singkat berita')
    konten = models.TextField(help_text='Isi berita (rich text)')
    kategori = models.CharField(
        max_length=50,
        default='Edukasi',
    )
    thumbnail = models.ImageField(upload_to='berita/', blank=True, null=True)
    thumbnail_url = models.URLField(max_length=500, blank=True, default='')
    status = models.CharField(
        max_length=20,
        choices=BeritaStatus.CHOICES,
        default=BeritaStatus.PUBLISHED,
    )
    author = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='berita_list',
    )
    author_name = models.CharField(max_length=255, blank=True, default='Tim Redaksi SETARA')
    waktu_baca = models.CharField(max_length=50, blank=True, default='4 menit')
    views = models.PositiveIntegerField(default=0)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'berita'
        verbose_name = 'Berita'
        verbose_name_plural = 'Berita'
        ordering = ['-created_at']

    def __str__(self):
        return self.judul

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.judul)
            slug = base_slug
            counter = 1
            while Berita.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base_slug}-{counter}'
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
