"""
Ninja schemas for Accounts app.
Request/Response validation schemas for authentication endpoints.
"""

from ninja import Schema
from typing import Optional
from datetime import datetime
from uuid import UUID


# ==============================================================================
# REQUEST SCHEMAS
# ==============================================================================

class RegisterIn(Schema):
    email: str
    password: str
    full_name: str


class LoginIn(Schema):
    email: str
    password: str


class RefreshTokenIn(Schema):
    refresh_token: str


class UserUpdateIn(Schema):
    full_name: Optional[str] = None
    bio: Optional[str] = None


class ChangePasswordIn(Schema):
    old_password: str
    new_password: str


# ==============================================================================
# RESPONSE SCHEMAS
# ==============================================================================

class UserOut(Schema):
    id: UUID
    email: str
    full_name: str
    nama: Optional[str] = None
    avatar: Optional[str] = None
    role: str
    bio: str
    is_komunitas_member: bool
    joined_komunitas_at: Optional[datetime] = None
    date_joined: datetime


class TokenOut(Schema):
    access_token: str
    refresh_token: str
    token_type: str = 'bearer'
    user: Optional[UserOut] = None


class MessageOut(Schema):
    message: str


class ErrorOut(Schema):
    detail: str
