"""
Translator service for SETARA project.
Core translation logic: text-to-sign and sign-to-text.
"""

from apps.video.models import Video


class TranslatorService:
    """Service class for translation operations."""

    @staticmethod
    def text_to_sign(teks: str, tipe_bahasa: str = 'BISINDO'):
        """
        Convert text string to sequence of sign videos / animations.
        Splits into words, searches dictionary strictly by kata & tipe_bahasa (or BOTH).
        Does NOT cross-fallback between SIBI and BISINDO because they are distinct languages.
        """
        clean_text = teks.strip().lower()
        kata_list = [k.strip(',.!?"\'') for k in clean_text.split() if k.strip(',.!?"\'')]

        videos = []
        kata_tidak_tersedia = []

        # Bahasa yang diizinkan: tipe_bahasa yang dipilih ATAU kata bertipe 'BOTH' (keduanya)
        allowed_types = [tipe_bahasa, 'BOTH']

        for kata in kata_list:
            # 1. Cari video sesuai kata & tipe_bahasa yang dipilih (atau BOTH), prioritaskan yang memiliki file/URL video aktif
            video = Video.objects.filter(
                kata__iexact=kata,
                tipe_bahasa__in=allowed_types,
                status='active',
            ).exclude(video_url='', video_file='').first()

            if not video:
                # Cari jika ada entri dengan tipe_bahasa yang cocok
                video = Video.objects.filter(
                    kata__iexact=kata,
                    tipe_bahasa__in=allowed_types,
                    status='active',
                ).first()

            # Hanya gunakan video jika memang cocok dengan tipe bahasa yang dipilih dan memiliki berkas/URL video
            has_media = video and bool(video.video_url or video.video_file)

            if video and has_media:
                v_url = video.video_url or (video.video_file.url if video.video_file else None)
                thumb = video.thumbnail_url or (video.thumbnail.url if video.thumbnail else None)
                videos.append({
                    'kata': kata,
                    'video_url': v_url,
                    'thumbnail': thumb,
                    'gesture_pattern': video.gesture_pattern or 'hand_wave_forehead',
                    'durasi': video.durasi or 2,
                    'tersedia': True,
                })
            else:
                videos.append({
                    'kata': kata,
                    'video_url': None,
                    'thumbnail': None,
                    'gesture_pattern': 'hand_wave_forehead',
                    'durasi': 1,
                    'tersedia': False,
                })
                kata_tidak_tersedia.append(kata)

        return {
            'input_teks': teks,
            'tipe_bahasa': tipe_bahasa,
            'kata_list': kata_list,
            'videos': videos,
            'total_kata': len(kata_list),
            'kata_tersedia': len(kata_list) - len(kata_tidak_tersedia),
            'kata_tidak_tersedia': kata_tidak_tersedia,
        }

    @staticmethod
    def sign_to_text(frame_data, tipe_bahasa='BISINDO'):
        """
        Convert sign language gesture to text.
        Placeholder - Fase 2 YOLO 11 model integration.
        """
        return {
            'detected_text': 'Halo',
            'confidence': 0.92,
            'tipe_bahasa': tipe_bahasa,
        }
