"""Ninja schemas for Berita app."""

from ninja import Schema
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class BeritaCreateIn(Schema):
    judul: str
    konten: str
    ringkasan: Optional[str] = ''
    kategori: Optional[str] = 'Edukasi'
    status: Optional[str] = 'published'
    author_name: Optional[str] = 'Tim Redaksi SETARA'
    waktu_baca: Optional[str] = '4 menit'
    thumbnail_url: Optional[str] = ''


class BeritaUpdateIn(Schema):
    judul: Optional[str] = None
    konten: Optional[str] = None
    ringkasan: Optional[str] = None
    kategori: Optional[str] = None
    status: Optional[str] = None
    author_name: Optional[str] = None
    waktu_baca: Optional[str] = None
    thumbnail_url: Optional[str] = None


class BeritaOut(Schema):
    id: UUID
    judul: str
    slug: str
    ringkasan: str
    konten: str
    kategori: str
    thumbnail: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: str
    author_name: str
    waktu_baca: str
    views: int
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None


class BeritaListOut(Schema):
    id: UUID
    judul: str
    slug: str
    ringkasan: str
    kategori: str
    thumbnail: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: str
    author_name: str
    waktu_baca: str
    views: int
    published_at: Optional[datetime] = None


class BeritaPaginatedOut(Schema):
    count: int
    page: int
    page_size: int
    total_pages: int
    results: List[BeritaListOut]
