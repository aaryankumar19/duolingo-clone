import json

from django.http import JsonResponse
from common.exceptions import ValidationException


class JsonUtilsMixin:
    """Reusable helpers for JSON-based API views."""

    @staticmethod
    def _parse_json(request) -> dict | None:
        """
        Parse the request body as JSON.

        Returns:
            dict | None: Parsed JSON data, or None if invalid JSON.
        """
        if not request.body:
            return None

        try:
            return json.loads(request.body)
        except (json.JSONDecodeError, UnicodeDecodeError):
            return None

    @staticmethod
    def _json_success(data=None, code="SUCCESS", status=200):
        """
        Return a standardized JSON success response.
        """
        return JsonResponse(
            {
                "data": data,
                "code": code,
            },
            status=status,
        )

    @staticmethod
    def _json_error(message, code="BAD_REQUEST", status=400):
        """
        Return a standardized JSON error response.
        """
        return JsonResponse(
            {
                "error": {
                    "message": message,
                    "code": code,
                }
            },
            status=status,
        )