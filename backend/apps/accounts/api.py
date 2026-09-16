"""
API endpoints for Accounts app.
Authentication & user management - PRD Section 9.1
"""

from ninja import Router, File
from ninja.files import UploadedFile
from django.http import HttpRequest

from shared.utils.permissions import AuthBearer
from apps.accounts.schemas import (
    RegisterIn, LoginIn, RefreshTokenIn,
    UserUpdateIn, ChangePasswordIn,
    TokenOut, UserOut, MessageOut, ErrorOut,
)
from apps.accounts.services import AuthService

router = Router()
auth = AuthBearer()


@router.post('/register', response={201: TokenOut, 400: ErrorOut})
def register(request: HttpRequest, data: RegisterIn):
    """Register a new user account."""
    try:
        user, tokens = AuthService.register_user(
            email=data.email,
            password=data.password,
            full_name=data.full_name,
        )
        return 201, tokens
    except ValueError as e:
        return 400, {'detail': str(e)}


@router.post('/login', response={200: TokenOut, 401: ErrorOut})
def login(request: HttpRequest, data: LoginIn):
    """Login and get JWT tokens."""
    tokens = AuthService.login_user(data.email, data.password)
    if tokens:
        return 200, tokens
    return 401, {'detail': 'Email atau password salah'}


@router.post('/refresh', response={200: TokenOut, 401: ErrorOut})
def refresh_token(request: HttpRequest, data: RefreshTokenIn):
    """Refresh access token using refresh token."""
    tokens = AuthService.refresh_access_token(data.refresh_token)
    if tokens:
        return 200, tokens
    return 401, {'detail': 'Refresh token tidak valid atau expired'}


@router.get('/me', response=UserOut, auth=auth)
def get_me(request: HttpRequest):
    """Get authenticated user profile."""
    user = request.auth
    return UserOut(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        nama=user.full_name,
        avatar=user.avatar.url if user.avatar else None,
        role=user.role,
        bio=user.bio,
        is_komunitas_member=user.is_komunitas_member,
        joined_komunitas_at=user.joined_komunitas_at,
        date_joined=user.date_joined,
    )


@router.put('/me', response=UserOut, auth=auth)
def update_me(request: HttpRequest, data: UserUpdateIn):
    """Update authenticated user profile."""
    user = request.auth
    if data.full_name is not None:
        user.full_name = data.full_name
    if data.bio is not None:
        user.bio = data.bio
    user.save()
    return UserOut(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        nama=user.full_name,
        avatar=user.avatar.url if user.avatar else None,
        role=user.role,
        bio=user.bio,
        is_komunitas_member=user.is_komunitas_member,
        joined_komunitas_at=user.joined_komunitas_at,
        date_joined=user.date_joined,
    )


@router.post('/change-password', response={200: MessageOut, 400: ErrorOut}, auth=auth)
def change_password(request: HttpRequest, data: ChangePasswordIn):
    """Change user password."""
    user = request.auth
    if not user.check_password(data.old_password):
        return 400, {'detail': 'Password lama salah'}
    user.set_password(data.new_password)
    user.save()
    return 200, {'message': 'Password berhasil diubah'}
