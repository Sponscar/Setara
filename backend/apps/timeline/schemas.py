"""Ninja schemas for Timeline app."""

from ninja import Schema
from typing import Optional
from uuid import UUID


class TimelineCreateIn(Schema):
    judul: str
    deskripsi: str
    tanggal: str
    tahun: Optional[str] = ''
    kategori: Optional[str] = 'Pencapaian'
    icon: Optional[str] = 'Sparkles'
    gambar_url: Optional[str] = ''
    urutan: Optional[int] = 0


class TimelineUpdateIn(Schema):
    judul: Optional[str] = None
    deskripsi: Optional[str] = None
    tanggal: Optional[str] = None
    tahun: Optional[str] = None
    kategori: Optional[str] = None
    icon: Optional[str] = None
    gambar_url: Optional[str] = None
    urutan: Optional[int] = None
    is_active: Optional[bool] = None


class TimelineOut(Schema):
    id: UUID
    tahun: str
    tanggal: str
    judul: str
    deskripsi: str
    kategori: str
    icon: str
    gambar: Optional[str] = None
    gambar_url: Optional[str] = None
    urutan: int
    is_active: bool
