"""
API endpoints for Video app.
Manajemen video & kamus isyarat - PRD Section 9.3 & Video CMS
"""

import os
from ninja import Router, File
from ninja.files import UploadedFile
from django.http import HttpRequest
from typing import Optional, List
from uuid import UUID

from shared.utils.permissions import AuthBearer, is_admin
from shared.utils.pagination import paginate_queryset
from apps.video.models import Video
from apps.video.schemas import (
    VideoCreateIn, VideoUpdateIn,
    VideoOut, VideoPaginatedOut,
)
from apps.accounts.schemas import ErrorOut, MessageOut

router = Router()
auth = AuthBearer()


def _video_to_out(v):
    video_f = v.video_file.url if v.video_file else None
    thumb = v.thumbnail.url if v.thumbnail else None
    return {
        'id': v.id,
        'kata': v.kata,
        'tipe_bahasa': v.tipe_bahasa,
        'kategori': v.kategori or 'Umum',
        'tag': v.tag or '',
        'durasi': v.durasi,
        'gesture_pattern': v.gesture_pattern or 'hand_wave_forehead',
        'deskripsi_gerakan': v.deskripsi_gerakan or '',
        'video_file': video_f,
        'video_url': v.video_url or video_f or '',
        'thumbnail': thumb,
        'thumbnail_url': v.thumbnail_url or thumb or '',
        'status': v.status,
        'tersedia': v.status == 'active',
        'created_at': v.created_at,
    }


@router.get('/', response=VideoPaginatedOut)
def list_video(
    request: HttpRequest,
    page: int = 1,
    page_size: int = 20,
    tipe_bahasa: Optional[str] = None,
    tag: Optional[str] = None,
):
    """List video with pagination and filtering."""
    qs = Video.objects.filter(status='active')
    if tipe_bahasa:
        qs = qs.filter(tipe_bahasa=tipe_bahasa)
    if tag:
        qs = qs.filter(tag__icontains=tag)

    paginated = paginate_queryset(qs, page, page_size)
    paginated['results'] = [_video_to_out(v) for v in paginated['results']]
    return paginated


@router.get('/all', response={200: List[VideoOut], 403: ErrorOut}, auth=auth)
def list_all_video(request: HttpRequest):
    """List all videos for dictionary CMS (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat melihat seluruh daftar video'}
    qs = Video.objects.all().order_by('-created_at')
    return 200, [_video_to_out(v) for v in qs]


@router.get('/dictionary', response=List[VideoOut])
def dictionary_list(request: HttpRequest):
    """Get entire active dictionary list for frontend tokenizer."""
    qs = Video.objects.filter(status='active').order_by('kata')
    return [_video_to_out(v) for v in qs]


@router.get('/cari', response=List[VideoOut])
def cari_video(
    request: HttpRequest,
    kata: str,
    tipe_bahasa: Optional[str] = None,
):
    """Search video by word/kata."""
    qs = Video.objects.filter(kata__icontains=kata, status='active')
    if tipe_bahasa:
        qs = qs.filter(tipe_bahasa=tipe_bahasa)
    return [_video_to_out(v) for v in qs[:10]]


@router.get('/{id}', response={200: VideoOut, 404: ErrorOut})
def detail_video(request: HttpRequest, id: UUID):
    """Get video detail by ID."""
    video = Video.objects.filter(id=id).first()
    if not video:
        return 404, {'detail': 'Video tidak ditemukan'}
    return 200, _video_to_out(video)


@router.post('/', response={201: VideoOut, 403: ErrorOut}, auth=auth)
def create_video(request: HttpRequest, data: VideoCreateIn):
    """Create a new video entry (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat menambah video'}

    # get_or_create to prevent duplicate entries for the same word and language
    clean_kata = data.kata.lower().strip()
    video = Video.objects.filter(kata=clean_kata, tipe_bahasa=data.tipe_bahasa).first()
    if video:
        # Update existing
        video.kategori = data.kategori or video.kategori or 'Umum'
        video.tag = data.tag or video.tag or ''
        video.durasi = data.durasi or video.durasi or 2
        video.gesture_pattern = data.gesture_pattern or video.gesture_pattern or 'hand_wave_forehead'
        video.deskripsi_gerakan = data.deskripsi_gerakan or video.deskripsi_gerakan or ''
        if data.video_url:
            video.video_url = data.video_url
        if data.thumbnail_url:
            video.thumbnail_url = data.thumbnail_url
        video.status = 'active'
        video.save()
    else:
        video = Video.objects.create(
            kata=clean_kata,
            tipe_bahasa=data.tipe_bahasa,
            kategori=data.kategori or 'Umum',
            tag=data.tag or '',
            durasi=data.durasi or 2,
            gesture_pattern=data.gesture_pattern or 'hand_wave_forehead',
            deskripsi_gerakan=data.deskripsi_gerakan or '',
            video_url=data.video_url or '',
            thumbnail_url=data.thumbnail_url or '',
        )
    return 201, _video_to_out(video)


@router.put('/{id}', response={200: VideoOut, 403: ErrorOut, 404: ErrorOut}, auth=auth)
def update_video(request: HttpRequest, id: UUID, data: VideoUpdateIn):
    """Update a video entry (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat mengupdate video'}

    video = Video.objects.filter(id=id).first()
    if not video:
        return 404, {'detail': 'Video tidak ditemukan'}

    for field in ['kata', 'tipe_bahasa', 'kategori', 'tag', 'durasi', 'gesture_pattern', 'deskripsi_gerakan', 'video_url', 'thumbnail_url', 'status']:
        val = getattr(data, field)
        if val is not None:
            if field == 'kata':
                val = val.lower().strip()
            setattr(video, field, val)

    video.save()
    return 200, _video_to_out(video)


@router.delete('/{id}', response={200: MessageOut, 403: ErrorOut, 404: ErrorOut}, auth=auth)
def delete_video(request: HttpRequest, id: UUID):
    """Delete a video (Admin only)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat menghapus video'}

    video = Video.objects.filter(id=id).first()
    if not video:
        return 404, {'detail': 'Video tidak ditemukan'}

    video.delete()
    return 200, {'message': f'Video "{video.kata}" berhasil dihapus'}


@router.post('/{id}/upload', response={200: VideoOut, 400: ErrorOut, 403: ErrorOut, 404: ErrorOut}, auth=auth)
def upload_video_file(request: HttpRequest, id: UUID, file: UploadedFile = File(...)):
    """Upload video file (Admin only, Max 5MB, format mp4/webm/mov)."""
    if not is_admin(request):
        return 403, {'detail': 'Hanya admin yang dapat upload video'}

    video = Video.objects.filter(id=id).first()
    if not video:
        return 404, {'detail': 'Video tidak ditemukan'}

    # Validasi ekstensi
    allowed_exts = ('.mp4', '.webm', '.mov')
    file_ext = os.path.splitext(file.name.lower())[1]
    if file_ext not in allowed_exts:
        return 400, {'detail': f'Format file {file_ext} tidak didukung. Harap unggah video MP4 atau WebM.'}

    # Validasi ukuran berkas maksimal 5 MB
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
    if file.size > MAX_FILE_SIZE:
        size_mb = round(file.size / (1024 * 1024), 2)
        return 400, {'detail': f'Ukuran berkas video ({size_mb} MB) melebihi batas maksimal 5 MB.'}

    clean_filename = f"{video.kata}_{video.id.hex[:8]}{file_ext}"
    video.video_file.save(clean_filename, file, save=False)
    video.video_url = video.video_file.url
    video.save()
    return 200, _video_to_out(video)
