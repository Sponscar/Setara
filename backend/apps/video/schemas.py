"""Ninja schemas for Video app."""

from ninja import Schema
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class VideoCreateIn(Schema):
    kata: str
    tipe_bahasa: str = 'BISINDO'
    kategori: Optional[str] = 'Umum'
    tag: Optional[str] = ''
    durasi: Optional[int] = 2
    gesture_pattern: Optional[str] = 'hand_wave_forehead'
    deskripsi_gerakan: Optional[str] = ''
    video_url: Optional[str] = ''
    thumbnail_url: Optional[str] = ''


class VideoUpdateIn(Schema):
    kata: Optional[str] = None
    tipe_bahasa: Optional[str] = None
    kategori: Optional[str] = None
    tag: Optional[str] = None
    durasi: Optional[int] = None
    gesture_pattern: Optional[str] = None
    deskripsi_gerakan: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: Optional[str] = None


class VideoOut(Schema):
    id: UUID
    kata: str
    tipe_bahasa: str
    kategori: str
    tag: str
    durasi: int
    gesture_pattern: str
    deskripsi_gerakan: str
    video_file: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: str
    tersedia: bool = True
    created_at: datetime


class VideoPaginatedOut(Schema):
    count: int
    page: int
    page_size: int
    total_pages: int
    results: List[VideoOut]
