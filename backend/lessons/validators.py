from common.exceptions import ValidationException


class ExerciseSubmitValidator:
    """
    Validator for exercise submission payloads.
    """

    @classmethod
    def validate(cls, payload: dict | None) -> dict:
        if not isinstance(payload, dict):
            raise ValidationException("Request body must be a JSON object.")

        if "user_answer" not in payload:
            raise ValidationException("user_answer field is required.")

        user_answer = payload.get("user_answer")
        if user_answer is None:
            raise ValidationException("user_answer cannot be null.")

        return {"user_answer": user_answer}


class LessonCompleteValidator:
    """
    Validator for lesson completion payloads.
    """

    @classmethod
    def validate(cls, payload: dict | None) -> dict:
        if payload is not None and not isinstance(payload, dict):
            raise ValidationException("Request body must be a JSON object.")

        return payload or {}
