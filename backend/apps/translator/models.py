"""
TranslationHistory model for SETARA project.
Tracking translation history - PRD Section 5.
"""

import uuid
from django.db import models

from shared.constants import TipeTranslasi, TipeBahasa


class TranslationHistory(models.Model):
    """Model for tracking translation history."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='translations',
        blank=True,
        null=True,
    )
    tipe_translasi = models.CharField(
        max_length=20,
        choices=TipeTranslasi.CHOICES,
    )
    tipe_bahasa = models.CharField(
        max_length=10,
        choices=TipeBahasa.CHOICES,
    )
    input_text = models.TextField()
    output_text = models.TextField(blank=True, default='')
    video_ids = models.JSONField(default=list, blank=True)
    confidence_score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'translation_history'
        verbose_name = 'Translation History'
        verbose_name_plural = 'Translation Histories'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.tipe_translasi}: {self.input_text[:50]}'
