"""Ninja schemas for Translator app."""

from ninja import Schema
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class TextToSignIn(Schema):
    teks: str
    tipe_bahasa: str = 'BISINDO'


class VideoResult(Schema):
    kata: str
    video_url: Optional[str] = None
    thumbnail: Optional[str] = None
    gesture_pattern: Optional[str] = None
    durasi: int = 2
    tersedia: bool = True


class TextToSignOut(Schema):
    input_teks: str
    tipe_bahasa: str
    kata_list: List[str]
    videos: List[VideoResult]
    total_kata: int
    kata_tersedia: int
    kata_tidak_tersedia: List[str]


class SignToTextIn(Schema):
    frame_data: str
    tipe_bahasa: str = 'BISINDO'


class SignToTextOut(Schema):
    detected_text: str
    confidence: float
    tipe_bahasa: str


class TranslationHistoryOut(Schema):
    id: UUID
    tipe_translasi: str
    tipe_bahasa: str
    input_text: str
    output_text: str
    confidence_score: float
    created_at: datetime
