import re

from lessons.models import Exercise


class ExerciseAnswerService:
    """
    Service responsible for evaluating user answers against exercise correct_answer specs.
    """

    @staticmethod
    def _normalize_string(s: str) -> str:
        if not isinstance(s, str):
            return ""
        s = s.strip().lower()
        s = re.sub(r"[.!?]+$", "", s).strip()
        return " ".join(s.split())

    @classmethod
    def check(cls, exercise: Exercise, user_answer: any) -> tuple[bool, str]:
        """
        Evaluates user_answer against exercise.correct_answer.

        Returns:
            (is_correct: bool, canonical_correct_answer_str: str)
        """
        ex_type = exercise.exercise_type
        correct_spec = exercise.correct_answer

        if ex_type == Exercise.ExerciseType.MATCH_PAIRS:
            return cls._check_match_pairs(correct_spec, user_answer)
        elif ex_type == Exercise.ExerciseType.MULTIPLE_CHOICE:
            return cls._check_multiple_choice(correct_spec, user_answer)
        elif ex_type == Exercise.ExerciseType.TRANSLATE:
            return cls._check_translate(correct_spec, user_answer)
        else:
            return cls._check_text_answer(correct_spec, user_answer)

    @classmethod
    def _check_match_pairs(cls, correct_spec: any, user_answer: any) -> tuple[bool, str]:
        expected_pairs = (
            correct_spec.get("pairs") if isinstance(correct_spec, dict) else correct_spec
        )
        actual_pairs = (
            user_answer.get("pairs")
            if isinstance(user_answer, dict) and "pairs" in user_answer
            else user_answer
        )

        if not isinstance(expected_pairs, dict) or not isinstance(actual_pairs, dict):
            return False, str(expected_pairs)

        norm_expected = {
            cls._normalize_string(k): cls._normalize_string(v)
            for k, v in expected_pairs.items()
        }
        norm_actual = {
            cls._normalize_string(k): cls._normalize_string(v)
            for k, v in actual_pairs.items()
        }

        is_correct = norm_expected == norm_actual
        return is_correct, str(expected_pairs)

    @classmethod
    def _check_multiple_choice(cls, correct_spec: any, user_answer: any) -> tuple[bool, str]:
        expected_str = (
            correct_spec.get("answer") if isinstance(correct_spec, dict) else str(correct_spec)
        )

        if isinstance(user_answer, dict):
            actual_str = (
                user_answer.get("selected_option")
                or user_answer.get("selected_option_id")
                or user_answer.get("user_answer")
                or user_answer.get("answer")
            )
        else:
            actual_str = user_answer

        is_correct = cls._normalize_string(str(expected_str)) == cls._normalize_string(
            str(actual_str)
        )
        return is_correct, str(expected_str)

    @classmethod
    def _check_translate(cls, correct_spec: any, user_answer: any) -> tuple[bool, str]:
        expected_str = (
            correct_spec.get("answer") if isinstance(correct_spec, dict) else str(correct_spec)
        )

        if isinstance(user_answer, list):
            actual_str = " ".join(str(item) for item in user_answer)
        elif isinstance(user_answer, dict):
            val = (
                user_answer.get("user_answer")
                or user_answer.get("answer")
                or user_answer.get("words")
            )
            if isinstance(val, list):
                actual_str = " ".join(str(item) for item in val)
            else:
                actual_str = str(val)
        else:
            actual_str = str(user_answer)

        is_correct = cls._normalize_string(str(expected_str)) == cls._normalize_string(actual_str)
        return is_correct, str(expected_str)

    @classmethod
    def _check_text_answer(cls, correct_spec: any, user_answer: any) -> tuple[bool, str]:
        expected_str = (
            correct_spec.get("answer") if isinstance(correct_spec, dict) else str(correct_spec)
        )

        if isinstance(user_answer, dict):
            actual_str = user_answer.get("user_answer") or user_answer.get("answer")
        else:
            actual_str = str(user_answer)

        is_correct = cls._normalize_string(str(expected_str)) == cls._normalize_string(
            str(actual_str)
        )
        return is_correct, str(expected_str)
