"""
URL configuration for SETARA project.
Django Ninja API mounted at /api/
"""

from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from ninja import NinjaAPI

from apps.accounts.api import router as accounts_router
from apps.berita.api import router as berita_router
from apps.video.api import router as video_router
from apps.translator.api import router as translator_router
from apps.timeline.api import router as timeline_router
from apps.komunitas.api import router as komunitas_router

api = NinjaAPI(
    title='SETARA API',
    description='API untuk Website Penerjemah Bahasa Isyarat SIBI & BISINDO',
    version='1.0.0',
)

# Register routers
api.add_router('/auth/', accounts_router, tags=['Authentication'])
api.add_router('/berita/', berita_router, tags=['Berita'])
api.add_router('/video/', video_router, tags=['Video'])
api.add_router('/translator/', translator_router, tags=['Translator'])
api.add_router('/timeline/', timeline_router, tags=['Timeline'])
api.add_router('/komunitas/', komunitas_router, tags=['Komunitas'])

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
