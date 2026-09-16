"""
API endpoints for Timeline app.
Timeline management - PRD Section 9.5
"""

from ninja import Router, File
from ninja.files import UploadedFile
from django.http import HttpRequest
from typing import List
from uuid import UUID

from shared.utils.permissions import AuthBearer, is_admin
from apps.timeline.models import Timeline
from apps.timeline.schemas import TimelineCreateIn, TimelineUpdateIn, TimelineOut
from apps.accounts.schemas import ErrorOut, MessageOut

router = Router()
auth = AuthBearer()


def _timeline_to_out(t):
    return {
        'id': t.id,
        'tahun': t.tahun or (t.tanggal.split()[-1] if ' ' in t.tanggal else ''),
        'tanggal': t.tanggal,
        'judul': t.judul,
        'deskripsi': t.deskripsi,
        'kategori': t.kategori,
        'icon': t.icon,
        'gambar': t.gambar.url if t.gambar else None,
        'gambar_url': t.gambar_url or (t.gambar.url if t.gambar else ''),
        'urutan': t.urutan,
        'is_active': t.is_active,
    }


@router.get('/', response=List[TimelineOut])
def list_timeline(request: HttpRequest):
    """List all active timeline milestones."""
    qs = Timeline.objects.filter(is_active=True).order_by('urutan', 'created_at')
    return [_timeline_to_out(t) for t in qs]


@router.post('/', response={201: TimelineOut, 403: ErrorOut}, auth=auth)
def create_timeline(request: HttpRequest, data: TimelineCreateIn):
    """Create a new timeline milestone (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat menambah timeline'}

    tahun = data.tahun
    if not tahun and ' ' in data.tanggal:
        parts = data.tanggal.split()
        if parts[-1].isdigit():
            tahun = parts[-1]

    timeline = Timeline.objects.create(
        judul=data.judul,
        deskripsi=data.deskripsi,
        tanggal=data.tanggal,
        tahun=tahun or '',
        kategori=data.kategori or 'Pencapaian',
        icon=data.icon or 'Sparkles',
        gambar_url=data.gambar_url or '',
        urutan=data.urutan or 0,
    )
    return 201, _timeline_to_out(timeline)


@router.put('/{id}', response={200: TimelineOut, 403: ErrorOut, 404: ErrorOut}, auth=auth)
def update_timeline(request: HttpRequest, id: UUID, data: TimelineUpdateIn):
    """Update a timeline milestone (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat mengupdate timeline'}

    timeline = Timeline.objects.filter(id=id).first()
    if not timeline:
        return 404, {'detail': 'Timeline tidak ditemukan'}

    for field in ['judul', 'deskripsi', 'tanggal', 'tahun', 'kategori', 'icon', 'gambar_url', 'urutan', 'is_active']:
        val = getattr(data, field)
        if val is not None:
            setattr(timeline, field, val)

    timeline.save()
    return 200, _timeline_to_out(timeline)


@router.delete('/{id}', response={200: MessageOut, 403: ErrorOut, 404: ErrorOut}, auth=auth)
def delete_timeline(request: HttpRequest, id: UUID):
    """Delete a timeline milestone (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat menghapus timeline'}

    timeline = Timeline.objects.filter(id=id).first()
    if not timeline:
        return 404, {'detail': 'Timeline tidak ditemukan'}

    timeline.delete()
    return 200, {'message': 'Timeline berhasil dihapus'}


@router.post('/{id}/upload-gambar', response={200: TimelineOut, 403: ErrorOut, 404: ErrorOut}, auth=auth)
def upload_gambar(request: HttpRequest, id: UUID, file: UploadedFile = File(...)):
    """Upload image for a timeline milestone (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat upload gambar'}

    timeline = Timeline.objects.filter(id=id).first()
    if not timeline:
        return 404, {'detail': 'Timeline tidak ditemukan'}

    timeline.gambar.save(file.name, file)
    timeline.gambar_url = timeline.gambar.url
    timeline.save()
    return 200, _timeline_to_out(timeline)
