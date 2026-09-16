"""
Video model for SETARA project.
Manajemen video & animasi isyarat SIBI & BISINDO - PRD Section 5 & Video CMS.
"""

import uuid
from django.db import models

from shared.constants import TipeBahasa, VideoStatus


class Video(models.Model):
    """Model for sign language video clips and gesture animations."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    kata = models.CharField(max_length=100, db_index=True, help_text='Kata yang diwakili')
    video_file = models.FileField(upload_to='video/isyarat/', blank=True, null=True)
    video_url = models.URLField(max_length=500, blank=True, default='')
    thumbnail = models.ImageField(upload_to='video/thumbnails/', blank=True, null=True)
    thumbnail_url = models.URLField(max_length=500, blank=True, default='')
    tipe_bahasa = models.CharField(
        max_length=10,
        choices=TipeBahasa.CHOICES,
        default=TipeBahasa.BISINDO,
    )
    kategori = models.CharField(max_length=100, blank=True, default='Umum')
    tag = models.CharField(max_length=100, blank=True, default='')
    durasi = models.PositiveIntegerField(default=2, help_text='Durasi video dalam detik')
    gesture_pattern = models.CharField(max_length=100, blank=True, default='hand_wave_forehead')
    deskripsi_gerakan = models.TextField(blank=True, default='')
    status = models.CharField(
        max_length=20,
        choices=VideoStatus.CHOICES,
        default=VideoStatus.ACTIVE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'videos'
        verbose_name = 'Video'
        verbose_name_plural = 'Videos'
        ordering = ['kata']
        indexes = [
            models.Index(fields=['kata', 'tipe_bahasa']),
        ]

    def __str__(self):
        return f'{self.kata} ({self.tipe_bahasa})'
