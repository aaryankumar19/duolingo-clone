from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from common.exceptions import ValidationException
from common.jsonUtils import JsonUtilsMixin
from website.utils import require_auth
from .services import LessonService
from .validators import ExerciseSubmitValidator, LessonCompleteValidator


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(require_auth, name="dispatch")
class NextLessonView(JsonUtilsMixin, View):

    def get(self, request, skill_id):
        data = LessonService.get_next_lesson(request.user, skill_id)
        return self._json_success(
            data=data,
            code="NEXT_LESSON_RETRIEVED",
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(require_auth, name="dispatch")
class ExerciseSubmitView(JsonUtilsMixin, View):

    def post(self, request, exercise_id):
        payload = self._parse_json(request)
        if payload is None:
            raise ValidationException("Request body must contain valid JSON.")

        data = ExerciseSubmitValidator.validate(payload)
        result = LessonService.submit_exercise(
            request.user, exercise_id, data["user_answer"]
        )

        return self._json_success(
            data=result,
            code="EXERCISE_EVALUATED",
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(require_auth, name="dispatch")
class LessonCompleteView(JsonUtilsMixin, View):

    def post(self, request, lesson_id):
        payload = self._parse_json(request)
        validated_payload = LessonCompleteValidator.validate(payload)

        result = LessonService.complete_lesson(
            request.user, lesson_id, validated_payload
        )

        return self._json_success(
            data=result,
            code="LESSON_COMPLETED",
            status=200,
        )
