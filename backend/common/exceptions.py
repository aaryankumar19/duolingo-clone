class APIException(Exception):
    """Base class for custom API exceptions."""

    status_code = 400
    code = "BAD_REQUEST"

    def __init__(self, message: str, code: str | None = None, status_code: int | None = None):
        self.message = message
        if code is not None:
            self.code = code
        if status_code is not None:
            self.status_code = status_code
        super().__init__(message)


class ValidationException(APIException):
    """Exception raised for payload validation errors."""

    status_code = 400
    code = "VALIDATION_ERROR"


class ConflictException(APIException):
    """Exception raised for resource state or database constraint conflicts."""

    status_code = 409
    code = "CONFLICT"


class AuthenticationException(APIException):
    """Exception raised for authentication failures / invalid credentials."""

    status_code = 401
    code = "INVALID_CREDENTIALS"