import re

from common.exceptions import ValidationException


class RegisterValidator:

    EMAIL_PATTERN = re.compile(
        r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    )

    @classmethod
    def validate(cls, payload: dict) -> dict:
        if not isinstance(payload, dict):
            raise ValidationException(
                "Request body must be a JSON object."
            )

        email = payload.get("email")
        password = payload.get("password")
        age = payload.get("age")
        name = payload.get("name") or payload.get("full_name")

        if not email or not password:
            raise ValidationException(
                "Email and password are required."
            )

        if not isinstance(email, str) or not isinstance(password, str):
            raise ValidationException(
                "Email and password must be strings."
            )

        email = email.strip().lower()

        validated_data = {
            "email": email,
            "password": password,
        }

        if age is not None and str(age).strip() != "":
            try:
                age_int = int(age)
                if not 1 <= age_int <= 120:
                    raise ValueError()
                validated_data["age"] = age_int
            except (ValueError, TypeError):
                raise ValidationException(
                    "Age must be a valid integer between 1 and 120."
                )

        if not cls.EMAIL_PATTERN.match(email):
            raise ValidationException(
                "Enter a valid email address."
            )

        if len(password) < 8:
            raise ValidationException(
                "Password must contain at least 8 characters."
            )

        if name and isinstance(name, str) and name.strip():
            validated_data["name"] = name.strip()

        return validated_data


class LoginValidator:

    @classmethod
    def validate(cls, payload: dict) -> dict:
        if not isinstance(payload, dict):
            raise ValidationException(
                "Request body must be a JSON object."
            )

        identifier = payload.get("identifier") or payload.get("email") or payload.get("username")
        password = payload.get("password")

        if not identifier or not password:
            raise ValidationException(
                "Email/username and password are required."
            )

        if not isinstance(identifier, str) or not isinstance(password, str):
            raise ValidationException(
                "Identifier and password must be strings."
            )

        return {
            "identifier": identifier.strip(),
            "password": password,
        }


class LogoutValidator:

    @classmethod
    def validate(cls, payload: dict | None) -> dict:
        if payload is not None and not isinstance(payload, dict):
            raise ValidationException(
                "Request body must be a JSON object."
            )

        payload_dict = payload or {}
        clear_all = payload_dict.get("clear_all_sessions", False)

        if not isinstance(clear_all, bool):
            if isinstance(clear_all, str):
                clear_all = clear_all.strip().lower() in ("true", "1", "yes")
            else:
                clear_all = bool(clear_all)

        return {
            "clear_all_sessions": clear_all,
        }