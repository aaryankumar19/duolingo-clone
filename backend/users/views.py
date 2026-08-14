from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from common.exceptions import ValidationException
from common.jsonUtils import JsonUtilsMixin
from website.utils import require_auth
from .services import AuthService, SessionService, UserService
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
                    "streak": user.streak_count,
                    "streak_count": user.streak_count,
                    "auth_token": auth_token,
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
                    "streak": user.streak_count,
                    "streak_count": user.streak_count,
                    "auth_token": auth_token,
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


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(require_auth, name="dispatch")
class HeartRefillView(JsonUtilsMixin, View):

    def post(self, request):
        result = UserService.refill_hearts_with_gems(request.user)
        return self._json_success(
            data=result,
            code="HEARTS_REFILLED",
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(require_auth, name="dispatch")
class ProfileView(JsonUtilsMixin, View):

    def get(self, request):
        profile_data = UserService.get_profile(request.user)
        return self._json_success(
            data=profile_data,
            code="PROFILE_RETRIEVED",
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(require_auth, name="dispatch")
class ActivityTodayView(JsonUtilsMixin, View):

    def get(self, request):
        today_data = UserService.get_today_activity(request.user)
        return self._json_success(
            data=today_data,
            code="TODAY_ACTIVITY_RETRIEVED",
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(require_auth, name="dispatch")
class ActivityHistoryView(JsonUtilsMixin, View):

    def get(self, request):
        days_param = request.GET.get("days", 7)
        try:
            days = int(days_param)
            if days <= 0 or days > 365:
                days = 7
        except (ValueError, TypeError):
            days = 7

        history_data = UserService.get_activity_history(request.user, days=days)
        return self._json_success(
            data={"activities": history_data},
            code="ACTIVITY_HISTORY_RETRIEVED",
            status=200,
        )
