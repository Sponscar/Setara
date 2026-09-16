"""
API endpoints for Komunitas app.
Mencakup direktori organisasi/komunitas, aktivitas, testimoni, dan keanggotaan.
"""

from ninja import Router, File
from ninja.files import UploadedFile
from django.http import HttpRequest
from django.utils import timezone
from typing import List, Optional
from uuid import UUID

from shared.utils.permissions import AuthBearer, OptionalAuthBearer, is_admin
from apps.accounts.schemas import ErrorOut, MessageOut
from apps.komunitas.models import (
    Komunitas, KomunitasActivity, KomunitasMember, KomunitasTestimonial
)
from apps.komunitas.schemas import (
    KomunitasDirectoryOut, KomunitasDirectoryIn, KomunitasDirectoryUpdateIn,
    ActivityOut, ActivityCreateIn, ActivityUpdateIn,
    TestimonialOut, TestimonialCreateIn,
    JoinKomunitasIn, PublicMemberOut, AdminMemberOut,
)

router = Router()
auth = AuthBearer()
optional_auth = OptionalAuthBearer()


# ==============================================================================
# HELPER SERIALIZERS
# ==============================================================================

def _komunitas_to_out(k: Komunitas) -> dict:
    return {
        'id': k.id,
        'nama': k.nama,
        'deskripsi': k.deskripsi,
        'deskripsi_lengkap': k.deskripsi_lengkap or '',
        'kategori': k.kategori,
        'platform': k.platform,
        'link': k.link or '',
        'logo': k.logo.url if k.logo else None,
        'logo_url': k.logo_url or (k.logo.url if k.logo else ''),
        'anggota': k.anggota or '',
        'status': k.status,
        'kontak': k.kontak or '',
        'email_kontak': k.email_kontak or '',
        'created_at': k.created_at,
    }


def _activity_to_out(a: KomunitasActivity) -> dict:
    return {
        'id': a.id,
        'judul': a.judul,
        'deskripsi': a.deskripsi,
        'tipe': a.tipe,
        'tanggal_mulai': a.tanggal_mulai,
        'tanggal_selesai': a.tanggal_selesai,
        'lokasi': a.lokasi,
        'gambar': a.gambar.url if a.gambar else None,
        'is_active': a.is_active,
        'created_at': a.created_at,
    }


def _testimonial_to_out(t: KomunitasTestimonial) -> dict:
    avatar = t.avatar.url if t.avatar else None
    if not avatar and t.user and t.user.avatar:
        avatar = t.user.avatar.url
    return {
        'id': t.id,
        'nama': t.nama,
        'peran': t.peran,
        'avatar': avatar,
        'avatar_url': t.avatar_url or avatar or '',
        'konten': t.konten,
        'rating': t.rating,
        'created_at': t.created_at,
    }


def _member_to_admin_out(m: KomunitasMember) -> dict:
    return {
        'id': m.id,
        'user_id': m.user.id,
        'email': m.user.email,
        'full_name': m.user.full_name,
        'avatar': m.user.avatar.url if m.user.avatar else None,
        'alasan_bergabung': m.alasan_bergabung,
        'status': m.status,
        'approved_at': m.approved_at,
        'approved_by': m.approved_by.email if m.approved_by else None,
        'created_at': m.created_at,
    }


# ==============================================================================
# DIREKTORI KOMUNITAS (GERKATIN, SLIC, DLL)
# ==============================================================================

@router.get('/directories', response=List[KomunitasDirectoryOut])
def list_directories(request: HttpRequest, status: Optional[str] = None):
    """List komunitas / organisasi direktori."""
    qs = Komunitas.objects.all()
    if status:
        qs = qs.filter(status=status)
    else:
        # Default publik: hanya yang sudah diapprove
        qs = qs.filter(status='approved')
    return [_komunitas_to_out(k) for k in qs]


@router.get('/directories/all', response={200: List[KomunitasDirectoryOut], 403: ErrorOut}, auth=auth)
def list_all_directories(request: HttpRequest):
    """List all komunitas for admin management."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat mengakses seluruh direktori'}
    qs = Komunitas.objects.all()
    return 200, [_komunitas_to_out(k) for k in qs]


@router.post('/directories/submit', response={201: KomunitasDirectoryOut})
def submit_directory(request: HttpRequest, data: KomunitasDirectoryIn):
    """Pengajuan komunitas dari masyarakat umum (status pending)."""
    komunitas = Komunitas.objects.create(
        nama=data.nama,
        deskripsi=data.deskripsi,
        deskripsi_lengkap=data.deskripsi_lengkap or '',
        kategori=data.kategori or 'Organisasi Tuli',
        platform=data.platform or 'Website',
        link=data.link or '',
        logo_url=data.logo_url or '',
        anggota=data.anggota or '',
        kontak=data.kontak or '',
        email_kontak=data.email_kontak or '',
        status='pending'
    )
    return 201, _komunitas_to_out(komunitas)


@router.post('/directories', response={201: KomunitasDirectoryOut, 403: ErrorOut}, auth=auth)
def create_directory_admin(request: HttpRequest, data: KomunitasDirectoryIn):
    """Admin membuat komunitas baru (langsung approved)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat menambah komunitas'}
    komunitas = Komunitas.objects.create(
        nama=data.nama,
        deskripsi=data.deskripsi,
        deskripsi_lengkap=data.deskripsi_lengkap or '',
        kategori=data.kategori or 'Organisasi Tuli',
        platform=data.platform or 'Website',
        link=data.link or '',
        logo_url=data.logo_url or '',
        anggota=data.anggota or '',
        kontak=data.kontak or '',
        email_kontak=data.email_kontak or '',
        status='approved'
    )
    return 201, _komunitas_to_out(komunitas)


@router.put('/directories/{id}', response={200: KomunitasDirectoryOut, 403: ErrorOut, 404: ErrorOut}, auth=auth)
def update_directory(request: HttpRequest, id: UUID, data: KomunitasDirectoryUpdateIn):
    """Update data komunitas (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat mengupdate komunitas'}

    komunitas = Komunitas.objects.filter(id=id).first()
    if not komunitas:
        return 404, {'detail': 'Komunitas tidak ditemukan'}

    for field in ['nama', 'deskripsi', 'deskripsi_lengkap', 'kategori', 'platform', 'link', 'logo_url', 'anggota', 'kontak', 'email_kontak', 'status']:
        val = getattr(data, field)
        if val is not None:
            setattr(komunitas, field, val)

    komunitas.save()
    return 200, _komunitas_to_out(komunitas)


@router.delete('/directories/{id}', response={200: MessageOut, 403: ErrorOut, 404: ErrorOut}, auth=auth)
def delete_directory(request: HttpRequest, id: UUID):
    """Hapus komunitas (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat menghapus komunitas'}

    komunitas = Komunitas.objects.filter(id=id).first()
    if not komunitas:
        return 404, {'detail': 'Komunitas tidak ditemukan'}

    komunitas.delete()
    return 200, {'message': f'Komunitas "{komunitas.nama}" berhasil dihapus'}


@router.post('/directories/{id}/approve', response={200: MessageOut, 403: ErrorOut, 404: ErrorOut}, auth=auth)
def approve_directory(request: HttpRequest, id: UUID):
    """Setujui pengajuan komunitas (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat menyetujui komunitas'}

    komunitas = Komunitas.objects.filter(id=id).first()
    if not komunitas:
        return 404, {'detail': 'Komunitas tidak ditemukan'}

    komunitas.status = 'approved'
    komunitas.save(update_fields=['status', 'updated_at'])
    return 200, {'message': f'Komunitas "{komunitas.nama}" berhasil disetujui'}


@router.post('/directories/{id}/reject', response={200: MessageOut, 403: ErrorOut, 404: ErrorOut}, auth=auth)
def reject_directory(request: HttpRequest, id: UUID):
    """Tolak pengajuan komunitas (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat menolak komunitas'}

    komunitas = Komunitas.objects.filter(id=id).first()
    if not komunitas:
        return 404, {'detail': 'Komunitas tidak ditemukan'}

    komunitas.status = 'rejected'
    komunitas.save(update_fields=['status', 'updated_at'])
    return 200, {'message': f'Pengajuan komunitas "{komunitas.nama}" ditolak'}


@router.post('/directories/{id}/upload-logo', response={200: KomunitasDirectoryOut, 403: ErrorOut, 404: ErrorOut}, auth=auth)
def upload_directory_logo(request: HttpRequest, id: UUID, file: UploadedFile = File(...)):
    """Upload logo komunitas (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat upload logo'}

    komunitas = Komunitas.objects.filter(id=id).first()
    if not komunitas:
        return 404, {'detail': 'Komunitas tidak ditemukan'}

    komunitas.logo.save(file.name, file)
    komunitas.logo_url = komunitas.logo.url
    komunitas.save()
    return 200, _komunitas_to_out(komunitas)


# ==============================================================================
# AKTIVITAS & TESTIMONI
# ==============================================================================

@router.get('/activities', response=List[ActivityOut])
def list_activities(request: HttpRequest, tipe: Optional[str] = None):
    qs = KomunitasActivity.objects.filter(is_active=True)
    if tipe:
        qs = qs.filter(tipe=tipe)
    return [_activity_to_out(a) for a in qs]


@router.get('/testimonials', response=List[TestimonialOut])
def list_testimonials(request: HttpRequest):
    qs = KomunitasTestimonial.objects.filter(is_active=True)
    return [_testimonial_to_out(t) for t in qs]


@router.post('/testimonials', response={201: TestimonialOut})
def create_testimonial(request: HttpRequest, data: TestimonialCreateIn):
    """Kirim testimoni pengguna."""
    testimonial = KomunitasTestimonial.objects.create(
        nama=data.nama or 'Pengguna SETARA',
        peran=data.peran or 'Pengguna SETARA',
        avatar_url=data.avatar_url or '',
        konten=data.konten,
        rating=max(1, min(5, data.rating)),
    )
    return 201, _testimonial_to_out(testimonial)


@router.delete('/testimonials/{id}', response={200: MessageOut, 403: ErrorOut, 404: ErrorOut}, auth=auth)
def delete_testimonial(request: HttpRequest, id: UUID):
    """Hapus testimoni (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat menghapus testimonial'}
    testimonial = KomunitasTestimonial.objects.filter(id=id).first()
    if not testimonial:
        return 404, {'detail': 'Testimonial tidak ditemukan'}
    testimonial.delete()
    return 200, {'message': 'Testimonial berhasil dihapus'}


# ==============================================================================
# KEANGGOTAAN USER
# ==============================================================================

@router.get('/members', response=List[PublicMemberOut])
def list_public_members(request: HttpRequest):
    qs = KomunitasMember.objects.filter(status='approved').select_related('user')
    result = []
    for m in qs:
        result.append({
            'id': m.id,
            'full_name': m.user.full_name or m.user.email.split('@')[0],
            'avatar': m.user.avatar.url if m.user.avatar else None,
            'role': m.user.role,
            'joined_at': m.approved_at or m.created_at,
        })
    return result


@router.post('/join', response={200: MessageOut, 201: MessageOut, 400: ErrorOut, 401: ErrorOut}, auth=auth)
def join_komunitas(request: HttpRequest, data: JoinKomunitasIn):
    user = request.user
    member = KomunitasMember.objects.filter(user=user).first()
    if member:
        if member.status == 'approved':
            return 400, {'detail': 'Anda sudah menjadi anggota komunitas terdaftar'}
        elif member.status == 'pending':
            return 200, {'message': 'Pendaftaran Anda sedang menunggu persetujuan admin'}
        else:
            member.status = 'pending'
            member.alasan_bergabung = data.alasan_bergabung
            member.save()
            return 200, {'message': 'Pendaftaran ulang berhasil diajukan'}

    KomunitasMember.objects.create(
        user=user,
        alasan_bergabung=data.alasan_bergabung,
        status='pending'
    )
    return 201, {'message': 'Pendaftaran berhasil diajukan, menunggu persetujuan'}
