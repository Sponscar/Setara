"""
Ninja schemas for Komunitas app.
Request and response validation schemas.
"""

from ninja import Schema
from typing import Optional, List
from datetime import datetime
from uuid import UUID


# ==============================================================================
# DIREKTORI KOMUNITAS SCHEMAS (ORGANISASI / KOMUNITAS TULI)
# ==============================================================================

class KomunitasDirectoryIn(Schema):
    nama: str
    deskripsi: str
    deskripsi_lengkap: Optional[str] = ''
    kategori: Optional[str] = 'Organisasi Tuli'
    platform: Optional[str] = 'Website'
    link: Optional[str] = ''
    logo_url: Optional[str] = ''
    anggota: Optional[str] = ''
    kontak: Optional[str] = ''
    email_kontak: Optional[str] = ''


class KomunitasDirectoryUpdateIn(Schema):
    nama: Optional[str] = None
    deskripsi: Optional[str] = None
    deskripsi_lengkap: Optional[str] = None
    kategori: Optional[str] = None
    platform: Optional[str] = None
    link: Optional[str] = None
    logo_url: Optional[str] = None
    anggota: Optional[str] = None
    kontak: Optional[str] = None
    email_kontak: Optional[str] = None
    status: Optional[str] = None


class KomunitasDirectoryOut(Schema):
    id: UUID
    nama: str
    deskripsi: str
    deskripsi_lengkap: str
    kategori: str
    platform: str
    link: str
    logo: Optional[str] = None
    logo_url: Optional[str] = None
    anggota: str
    status: str
    kontak: str
    email_kontak: str
    created_at: datetime


# ==============================================================================
# AKTIVITAS SCHEMAS
# ==============================================================================

class ActivityCreateIn(Schema):
    judul: str
    deskripsi: Optional[str] = ''
    tipe: str = 'event'
    tanggal_mulai: Optional[datetime] = None
    tanggal_selesai: Optional[datetime] = None
    lokasi: Optional[str] = ''


class ActivityUpdateIn(Schema):
    judul: Optional[str] = None
    deskripsi: Optional[str] = None
    tipe: Optional[str] = None
    tanggal_mulai: Optional[datetime] = None
    tanggal_selesai: Optional[datetime] = None
    lokasi: Optional[str] = None
    is_active: Optional[bool] = None


class ActivityOut(Schema):
    id: UUID
    judul: str
    deskripsi: str
    tipe: str
    tanggal_mulai: Optional[datetime] = None
    tanggal_selesai: Optional[datetime] = None
    lokasi: str
    gambar: Optional[str] = None
    is_active: bool
    created_at: datetime


# ==============================================================================
# TESTIMONIAL SCHEMAS
# ==============================================================================

class TestimonialCreateIn(Schema):
    nama: Optional[str] = None
    peran: Optional[str] = 'Pengguna SETARA'
    avatar_url: Optional[str] = ''
    konten: str
    rating: int = 5


class TestimonialOut(Schema):
    id: UUID
    nama: str
    peran: str
    avatar: Optional[str] = None
    avatar_url: Optional[str] = None
    konten: str
    rating: int
    created_at: datetime


# ==============================================================================
# MEMBER SCHEMAS
# ==============================================================================

class JoinKomunitasIn(Schema):
    alasan_bergabung: Optional[str] = ''


class PublicMemberOut(Schema):
    id: UUID
    full_name: str
    avatar: Optional[str] = None
    role: str
    joined_at: Optional[datetime] = None


class AdminMemberOut(Schema):
    id: UUID
    user_id: UUID
    email: str
    full_name: str
    avatar: Optional[str] = None
    alasan_bergabung: str
    status: str
    approved_at: Optional[datetime] = None
    approved_by: Optional[str] = None
    created_at: datetime
