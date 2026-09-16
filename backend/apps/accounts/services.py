"""
Authentication service for SETARA project.
Handles JWT token generation, verification, and refresh.
"""

import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from django.contrib.auth import authenticate

from apps.accounts.models import User


class AuthService:
    """Service class for authentication operations."""

    @staticmethod
    def generate_tokens(user):
        """
        Generate access and refresh JWT tokens for a user.

        Args:
            user: User instance

        Returns:
            dict with access_token, refresh_token, and user info
        """
        now = datetime.now(timezone.utc)
        jwt_settings = settings.JWT_SETTINGS

        # Access token
        access_payload = {
            'user_id': str(user.id),
            'email': user.email,
            'role': user.role,
            'type': 'access',
            'iat': now,
            'exp': now + timedelta(minutes=jwt_settings['ACCESS_TOKEN_LIFETIME_MINUTES']),
        }
        access_token = jwt.encode(
            access_payload,
            settings.SECRET_KEY,
            algorithm=jwt_settings['ALGORITHM']
        )

        # Refresh token
        refresh_payload = {
            'user_id': str(user.id),
            'type': 'refresh',
            'iat': now,
            'exp': now + timedelta(days=jwt_settings['REFRESH_TOKEN_LIFETIME_DAYS']),
        }
        refresh_token = jwt.encode(
            refresh_payload,
            settings.SECRET_KEY,
            algorithm=jwt_settings['ALGORITHM']
        )

        user_info = {
            'id': user.id,
            'email': user.email,
            'full_name': user.full_name,
            'nama': user.full_name,
            'avatar': user.avatar.url if user.avatar else None,
            'role': user.role,
            'bio': user.bio,
            'is_komunitas_member': user.is_komunitas_member,
            'joined_komunitas_at': user.joined_komunitas_at,
            'date_joined': user.date_joined,
        }

        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'bearer',
            'user': user_info,
        }

    @staticmethod
    def verify_token(token, token_type='access'):
        """Verify a JWT token."""
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.JWT_SETTINGS['ALGORITHM']]
            )
            if payload.get('type') != token_type:
                return None
            return payload
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return None

    @staticmethod
    def refresh_access_token(refresh_token):
        """Generate new access token from refresh token."""
        payload = AuthService.verify_token(refresh_token, token_type='refresh')
        if not payload:
            return None

        user_id = payload.get('user_id')
        try:
            user = User.objects.get(id=user_id, is_active=True)
            return AuthService.generate_tokens(user)
        except User.DoesNotExist:
            return None

    @staticmethod
    def login_user(email, password):
        """Authenticate user with email and password."""
        user = authenticate(email=email, password=password)
        if user and user.is_active:
            return AuthService.generate_tokens(user)
        return None

    @staticmethod
    def register_user(email, password, full_name=''):
        """Register a new user."""
        if User.objects.filter(email=email).exists():
            raise ValueError('Email sudah terdaftar')

        user = User.objects.create_user(
            email=email,
            password=password,
            full_name=full_name,
        )
        tokens = AuthService.generate_tokens(user)
        return user, tokens
