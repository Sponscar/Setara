"""
API endpoints for Translator app.
Core translation endpoints - PRD Section 9.4
"""

from ninja import Router
from django.http import HttpRequest
from typing import List

from shared.utils.permissions import AuthBearer, OptionalAuthBearer
from apps.translator.models import TranslationHistory
from apps.translator.services import TranslatorService
from apps.translator.schemas import (
    TextToSignIn, TextToSignOut,
    SignToTextIn, SignToTextOut,
    TranslationHistoryOut,
)
from apps.accounts.schemas import ErrorOut

router = Router()
auth = AuthBearer()


@router.post('/text-to-sign', response=TextToSignOut)
def text_to_sign(request: HttpRequest, data: TextToSignIn):
    """
    Translate text to sign language videos.
    Splits input into words, finds matching video for each.
    """
    result = TranslatorService.text_to_sign(data.teks, data.tipe_bahasa)

    # Save history if user is authenticated
    user = getattr(request, 'user', None)
    if user and hasattr(user, 'id'):
        try:
            video_ids = [
                str(v.get('id', ''))
                for v in result['videos']
                if v.get('tersedia')
            ]
            TranslationHistory.objects.create(
                user=user,
                tipe_translasi='text_to_sign',
                tipe_bahasa=data.tipe_bahasa,
                input_text=data.teks,
                output_text=', '.join(result['kata_list']),
                video_ids=video_ids,
            )
        except Exception:
            pass  # Don't fail translation if history save fails

    return result


@router.post('/sign-to-text', response=SignToTextOut)
def sign_to_text(request: HttpRequest, data: SignToTextIn):
    """
    Translate sign language gesture to text.
    Placeholder - YOLO 11 integration coming in Fase 2.
    """
    result = TranslatorService.sign_to_text(data.frame_data, data.tipe_bahasa)
    return result


@router.get('/history', response=List[TranslationHistoryOut], auth=auth)
def translation_history(request: HttpRequest):
    """Get translation history for authenticated user."""
    user = request.auth
    qs = TranslationHistory.objects.filter(user=user)[:50]
    return [
        {
            'id': h.id,
            'tipe_translasi': h.tipe_translasi,
            'tipe_bahasa': h.tipe_bahasa,
            'input_text': h.input_text,
            'output_text': h.output_text,
            'confidence_score': h.confidence_score,
            'created_at': h.created_at,
        }
        for h in qs
    ]
