from django.http import JsonResponse
from common.exceptions import APIException


class ExceptionHandlingMiddleware:
    """
    Middleware to catch custom API exceptions and convert them into
    standardized JSON error responses.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        if isinstance(exception, APIException):
            return JsonResponse(
                {
                    "error": {
                        "message": exception.message,
                        "code": exception.code,
                    }
                },
                status=exception.status_code,
            )
        return None
