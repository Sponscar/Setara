"""
Pagination utilities for Django Ninja.
Provides reusable pagination for list endpoints.
"""

from ninja import Schema
from typing import List, Any


class PaginatedResponseSchema(Schema):
    """Base paginated response schema."""
    count: int
    page: int
    page_size: int
    total_pages: int
    results: List[Any]


def paginate_queryset(queryset, page: int = 1, page_size: int = 10):
    """
    Paginate a Django queryset.

    Args:
        queryset: Django QuerySet to paginate
        page: Current page number (1-indexed)
        page_size: Number of items per page

    Returns:
        dict with count, page, page_size, total_pages, results
    """
    page = max(1, page)
    page_size = min(max(1, page_size), 100)  # Max 100 per page

    total_count = queryset.count()
    total_pages = max(1, (total_count + page_size - 1) // page_size)

    # Clamp page to valid range
    page = min(page, total_pages)

    start = (page - 1) * page_size
    end = start + page_size

    return {
        'count': total_count,
        'page': page,
        'page_size': page_size,
        'total_pages': total_pages,
        'results': list(queryset[start:end]),
    }
