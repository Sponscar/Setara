"""
JWT Authentication for Django Ninja.
Provides auth bearer class and admin permission decorator.
"""

import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from ninja.security import HttpBearer

from apps.accounts.models import User


class AuthBearer(HttpBearer):
    """
    JWT Bearer token authentication for Django Ninja.
    Extracts and validates JWT from Authorization header.
    """

    def authenticate(self, request, token):
        """Validate JWT token and return user."""
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.JWT_SETTINGS['ALGORITHM']]
            )

            if payload.get('type') != 'access':
                return None

            user_id = payload.get('user_id')
            if not user_id:
                return None

            user = User.objects.filter(id=user_id, is_active=True).first()
            if not user:
                return None

            request.user = user
            return user

        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None


class OptionalAuthBearer(HttpBearer):
    """
    Optional JWT authentication.
    Returns user if token valid, None otherwise (no 401).
    """

    def authenticate(self, request, token):
        """Validate JWT token, return user or None."""
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.JWT_SETTINGS['ALGORITHM']]
            )

            if payload.get('type') != 'access':
                return None

            user_id = payload.get('user_id')
            if not user_id:
                return None

            user = User.objects.filter(id=user_id, is_active=True).first()
            request.user = user
            return user

        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            request.user = None
            return None


def is_admin(request):
    """Check if authenticated user is admin."""
    return (
        hasattr(request, 'user')
        and request.user is not None
        and request.user.role == 'admin'
    )
