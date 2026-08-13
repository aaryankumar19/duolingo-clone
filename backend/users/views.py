from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from common.exceptions import ValidationException
from common.jsonUtils import JsonUtilsMixin
from .services import AuthService, SessionService
from .validators import LoginValidator, LogoutValidator, RegisterValidator


@method_decorator(csrf_exempt, name="dispatch")
class RegisterView(JsonUtilsMixin, View):

    def post(self, request):
        payload = self._parse_json(request)

        if payload is None:
            raise ValidationException("Request body must contain valid JSON.")

        data = RegisterValidator.validate(payload)
        user = AuthService.register(**data)

        auth_token = SessionService.create_session(user, ttl_days=31)

        return self._json_success(
            data={
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "age": user.age,
                    "avatar_url": user.avatar_url,
                    "xp": user.xp,
                    "gems": user.gems,
                    "hearts": user.hearts,
                    "auth_token": auth_token
                }
            },
            code="USER_REGISTERED",
            status=201,
        )


@method_decorator(csrf_exempt, name="dispatch")
class LoginView(JsonUtilsMixin, View):

    def post(self, request):
        payload = self._parse_json(request)

        if payload is None:
            raise ValidationException("Request body must contain valid JSON.")

        data = LoginValidator.validate(payload)
        user = AuthService.authenticate(**data)

        auth_token = SessionService.create_session(user, ttl_days=31)

        return self._json_success(
            data={
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "age": user.age,
                    "avatar_url": user.avatar_url,
                    "xp": user.xp,
                    "gems": user.gems,
                    "hearts": user.hearts,
                    "auth_token": auth_token
                }
            },
            code="USER_LOGGED_IN",
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
class LogoutView(JsonUtilsMixin, View):

    def post(self, request):
        payload = self._parse_json(request)
        data = LogoutValidator.validate(payload)

        auth_header = request.headers.get("Authorization", "")
        raw_token = None

        if auth_header.startswith("Bearer "):
            raw_token = auth_header[7:].strip()
        elif auth_header:
            raw_token = auth_header.strip()

        if not raw_token and payload and isinstance(payload, dict):
            raw_token = payload.get("auth_token")

        session = SessionService.get_session_by_raw_token(raw_token)

        clear_all = data["clear_all_sessions"]
        if clear_all:
            SessionService.revoke_all_for_user(session.user)
        else:
            SessionService.revoke(session)

        return self._json_success(
            data={"cleared_all_sessions": clear_all},
            code="USER_LOGGED_OUT",
            status=200,
        )
