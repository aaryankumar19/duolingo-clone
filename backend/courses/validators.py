import uuid

from common.exceptions import ValidationException


class CourseSelectValidator:
    """
    Validator for course selection requests.
    """

    @classmethod
    def validate(cls, payload: dict | None) -> dict:
        if not isinstance(payload, dict):
            raise ValidationException("Request body must be a JSON object.")

        course_id_raw = payload.get("course_id")
        if not course_id_raw:
            raise ValidationException("course_id is required.")

        try:
            course_id = uuid.UUID(str(course_id_raw))
        except (ValueError, TypeError):
            raise ValidationException("course_id must be a valid UUID.")

        return {"course_id": course_id}
