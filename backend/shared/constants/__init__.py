"""
Shared constants for SETARA project.
Enum choices and constant values used across apps.
"""


# ==============================================================================
# USER ROLE CHOICES
# ==============================================================================

class UserRole:
    ADMIN = 'admin'
    USER = 'user'
    EDUCATOR = 'educator'

    CHOICES = [
        (ADMIN, 'Admin'),
        (USER, 'User'),
        (EDUCATOR, 'Educator'),
    ]


# ==============================================================================
# BERITA CHOICES
# ==============================================================================

class BeritaKategori:
    EDUKASI = 'edukasi'
    KOMUNITAS = 'komunitas'
    TEKNOLOGI = 'teknologi'
    EVENT = 'event'

    CHOICES = [
        (EDUKASI, 'Edukasi'),
        (KOMUNITAS, 'Komunitas'),
        (TEKNOLOGI, 'Teknologi'),
        (EVENT, 'Event'),
    ]


class BeritaStatus:
    DRAFT = 'draft'
    PUBLISHED = 'published'

    CHOICES = [
        (DRAFT, 'Draft'),
        (PUBLISHED, 'Published'),
    ]


# ==============================================================================
# VIDEO CHOICES
# ==============================================================================

class TipeBahasa:
    SIBI = 'SIBI'
    BISINDO = 'BISINDO'

    CHOICES = [
        (SIBI, 'SIBI'),
        (BISINDO, 'BISINDO'),
    ]


class VideoStatus:
    ACTIVE = 'active'
    INACTIVE = 'inactive'

    CHOICES = [
        (ACTIVE, 'Active'),
        (INACTIVE, 'Inactive'),
    ]


# ==============================================================================
# TRANSLATOR CHOICES
# ==============================================================================

class TipeTranslasi:
    TEXT_TO_SIGN = 'text_to_sign'
    SIGN_TO_TEXT = 'sign_to_text'

    CHOICES = [
        (TEXT_TO_SIGN, 'Text to Sign'),
        (SIGN_TO_TEXT, 'Sign to Text'),
    ]


# ==============================================================================
# KOMUNITAS CHOICES
# ==============================================================================

class KomunitasActivityType:
    EVENT = 'event'
    WORKSHOP = 'workshop'
    PELATIHAN = 'pelatihan'
    PERTEMUAN = 'pertemuan'

    CHOICES = [
        (EVENT, 'Event'),
        (WORKSHOP, 'Workshop'),
        (PELATIHAN, 'Pelatihan'),
        (PERTEMUAN, 'Pertemuan'),
    ]


class MemberStatus:
    PENDING = 'pending'
    APPROVED = 'approved'
    REJECTED = 'rejected'

    CHOICES = [
        (PENDING, 'Pending'),
        (APPROVED, 'Approved'),
        (REJECTED, 'Rejected'),
    ]
