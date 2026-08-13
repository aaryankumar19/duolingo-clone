from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from common.exceptions import ValidationException
from common.jsonUtils import JsonUtilsMixin
from website.utils import require_auth
from .services import CourseService
from .validators import CourseSelectValidator


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(require_auth, name="dispatch")
class CourseListView(JsonUtilsMixin, View):

    def get(self, request):
        courses_data = CourseService.get_all_courses(request.user)
        return self._json_success(
            data={"courses": courses_data},
            code="COURSES_RETRIEVED",
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(require_auth, name="dispatch")
class CourseSelectView(JsonUtilsMixin, View):

    def post(self, request):
        payload = self._parse_json(request)
        if payload is None:
            raise ValidationException("Request body must contain valid JSON.")

        data = CourseSelectValidator.validate(payload)
        course = CourseService.select_course(request.user, data["course_id"])

        return self._json_success(
            data={
                "course": {
                    "id": str(course.id),
                    "title": course.title,
                    "source_language": course.source_language,
                    "target_language": course.target_language,
                    "flag_icon_url": course.flag_icon_url,
                }
            },
            code="COURSE_SELECTED",
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(require_auth, name="dispatch")
class CourseCurrentPathView(JsonUtilsMixin, View):

    def get(self, request):
        path_data = CourseService.get_current_path(request.user)
        if not path_data:
            return self._json_error(
                message="No active course selected.",
                code="NO_ACTIVE_COURSE",
                status=404,
            )

        return self._json_success(
            data=path_data,
            code="PATH_RETRIEVED",
            status=200,
        )
