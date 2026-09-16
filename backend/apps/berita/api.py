"""
API endpoints for Berita app.
CRUD berita/news - PRD Section 9.2 & News CMS
"""

from ninja import Router, File
from ninja.files import UploadedFile
from django.http import HttpRequest
from django.utils import timezone
from typing import Optional, List
from uuid import UUID

from shared.utils.permissions import AuthBearer, is_admin
from shared.utils.pagination import paginate_queryset
from apps.berita.models import Berita
from apps.berita.schemas import (
    BeritaCreateIn, BeritaUpdateIn,
    BeritaOut, BeritaListOut, BeritaPaginatedOut,
)
from apps.accounts.schemas import ErrorOut, MessageOut

router = Router()
auth = AuthBearer()


def _berita_to_out(b):
    """Convert Berita model to output schema."""
    thumb = b.thumbnail.url if b.thumbnail else None
    author = b.author_name
    if not author and b.author:
        author = b.author.full_name or b.author.email
    return {
        'id': b.id,
        'judul': b.judul,
        'slug': b.slug,
        'ringkasan': b.ringkasan or (b.konten[:160] + '...' if len(b.konten) > 160 else b.konten),
        'konten': b.konten,
        'kategori': b.kategori,
        'thumbnail': thumb,
        'thumbnail_url': b.thumbnail_url or thumb or '',
        'status': b.status,
        'author_name': author or 'Tim Redaksi SETARA',
        'waktu_baca': b.waktu_baca or '4 menit',
        'views': b.views,
        'created_at': b.created_at,
        'updated_at': b.updated_at,
        'published_at': b.published_at,
    }


@router.get('/', response=BeritaPaginatedOut)
def list_berita(
    request: HttpRequest,
    page: int = 1,
    page_size: int = 10,
    kategori: Optional[str] = None,
):
    """List published berita with pagination."""
    qs = Berita.objects.filter(is_deleted=False, status='published').select_related('author')
    if kategori and kategori.lower() != 'semua':
        qs = qs.filter(kategori__iexact=kategori)

    paginated = paginate_queryset(qs, page, page_size)
    paginated['results'] = [_berita_to_out(b) for b in paginated['results']]
    return paginated


@router.get('/all', response={200: List[BeritaOut], 403: ErrorOut}, auth=auth)
def list_all_berita(request: HttpRequest):
    """List all berita including drafts (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat melihat seluruh artikel'}
    qs = Berita.objects.filter(is_deleted=False).select_related('author')
    return 200, [_berita_to_out(b) for b in qs]


@router.get('/terbaru', response=List[BeritaListOut])
def berita_terbaru(request: HttpRequest):
    """Get 5 latest published berita."""
    qs = Berita.objects.filter(
        is_deleted=False, status='published'
    ).select_related('author')[:5]
    return [_berita_to_out(b) for b in qs]


@router.get('/{slug}', response={200: BeritaOut, 404: ErrorOut})
def detail_berita(request: HttpRequest, slug: str):
    """Get berita detail by slug or UUID. Increments view count."""
    qs = Berita.objects.filter(is_deleted=False).select_related('author')
    try:
        val_uuid = UUID(slug)
        berita = qs.filter(id=val_uuid).first()
    except ValueError:
        berita = qs.filter(slug=slug).first()

    if not berita:
        return 404, {'detail': 'Berita tidak ditemukan'}

    berita.views += 1
    berita.save(update_fields=['views'])
    return 200, _berita_to_out(berita)


@router.post('/', response={201: BeritaOut, 403: ErrorOut}, auth=auth)
def create_berita(request: HttpRequest, data: BeritaCreateIn):
    """Create a new berita (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat membuat berita'}

    berita = Berita.objects.create(
        judul=data.judul,
        konten=data.konten,
        ringkasan=data.ringkasan or (data.konten[:160] if data.konten else ''),
        kategori=data.kategori or 'Edukasi',
        status=data.status or 'published',
        author=request.user,
        author_name=data.author_name or (request.user.full_name if request.user else 'Tim Redaksi SETARA'),
        waktu_baca=data.waktu_baca or '4 menit',
        thumbnail_url=data.thumbnail_url or '',
        published_at=timezone.now() if data.status == 'published' else None,
    )
    return 201, _berita_to_out(berita)


@router.put('/{id}', response={200: BeritaOut, 403: ErrorOut, 404: ErrorOut}, auth=auth)
def update_berita(request: HttpRequest, id: UUID, data: BeritaUpdateIn):
    """Update a berita (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat mengupdate berita'}

    berita = Berita.objects.filter(id=id, is_deleted=False).select_related('author').first()
    if not berita:
        return 404, {'detail': 'Berita tidak ditemukan'}

    for field in ['judul', 'konten', 'ringkasan', 'kategori', 'status', 'author_name', 'waktu_baca', 'thumbnail_url']:
        val = getattr(data, field)
        if val is not None:
            setattr(berita, field, val)

    if data.status == 'published' and not berita.published_at:
        berita.published_at = timezone.now()

    berita.save()
    return 200, _berita_to_out(berita)


@router.delete('/{id}', response={200: MessageOut, 403: ErrorOut, 404: ErrorOut}, auth=auth)
def delete_berita(request: HttpRequest, id: UUID):
    """Soft delete a berita (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat menghapus berita'}

    berita = Berita.objects.filter(id=id, is_deleted=False).first()
    if not berita:
        return 404, {'detail': 'Berita tidak ditemukan'}

    berita.is_deleted = True
    berita.save(update_fields=['is_deleted'])
    return 200, {'message': 'Berita berhasil dihapus'}


@router.post('/{id}/upload-thumbnail', response={200: BeritaOut, 403: ErrorOut, 404: ErrorOut}, auth=auth)
def upload_thumbnail(request: HttpRequest, id: UUID, file: UploadedFile = File(...)):
    """Upload thumbnail for a berita (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat upload thumbnail'}

    berita = Berita.objects.filter(id=id, is_deleted=False).select_related('author').first()
    if not berita:
        return 404, {'detail': 'Berita tidak ditemukan'}

    berita.thumbnail.save(file.name, file)
    berita.thumbnail_url = berita.thumbnail.url
    berita.save()
    return 200, _berita_to_out(berita)
