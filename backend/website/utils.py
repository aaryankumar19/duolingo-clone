from functools import wraps
from django.http import HttpRequest

from common.exceptions import AuthenticationException
from users.services import SessionService


def require_auth(view_func):
    """
    Decorator for views that require authentication via Bearer session token.

    Extracts the Bearer token from the 'Authorization' header, validates the
    session via SessionService, and attaches `request.user` and `request.session_obj`.

    Raises:
        AuthenticationException: If token is missing, invalid, or expired.
    """
    @wraps(view_func)
    def _wrapped_view(*args, **kwargs):
        request = None
        for arg in args:
            if isinstance(arg, HttpRequest) or hasattr(arg, "headers"):
                request = arg
                break

        if not request:
            raise AuthenticationException("Authentication token is required.")

        auth_header = request.headers.get("Authorization", "")
        raw_token = None

        if auth_header.startswith("Bearer "):
            raw_token = auth_header[7:].strip()
        elif auth_header:
            raw_token = auth_header.strip()

        if not raw_token:
            raise AuthenticationException("Authentication token is required.")

        session = SessionService.get_session_by_raw_token(raw_token)

        request.user = session.user
        request.session_obj = session

        return view_func(*args, **kwargs)

    return _wrapped_view
