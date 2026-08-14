from django.db import transaction

from common.exceptions import ValidationException
from courses.models import Course, Section, Unit
from progress.models import UserLessonHistory, UserUnitProgress
from users.models import User, UserCourse
from users.services import UserService
from .answer_checkers import ExerciseAnswerService
from .models import Exercise, Lesson


class LessonService:

    @staticmethod
    def get_next_lesson(user: User, unit_id) -> dict:
        """
        Finds the next uncompleted lesson for the specified unit/skill.
        Validates access and returns lesson details with exercises.
        """
        unit = (
            Unit.objects.filter(id=unit_id)
            .select_related("section", "section__course")
            .first()
        )
        if not unit:
            raise ValidationException("Skill/unit not found.", code="NOT_FOUND", status_code=404)

        course = unit.section.course
        is_enrolled = UserCourse.objects.filter(user=user, course=course).exists()
        if not is_enrolled:
            raise ValidationException(
                "You are not enrolled in this course.", code="NOT_ENROLLED", status_code=403
            )

        progress = UserUnitProgress.objects.filter(user=user, unit=unit).first()
        is_first_unit = unit.section.order == 1 and unit.order == 1
        is_unlocked = progress.is_unlocked if progress else is_first_unit

        if not is_unlocked:
            raise ValidationException(
                "This skill/unit is locked.", code="UNIT_LOCKED", status_code=403
            )

        if user.hearts <= 0:
            raise ValidationException(
                "You are out of hearts. Refill your hearts to start a lesson.",
                code="OUT_OF_HEARTS",
                status_code=403,
            )

        completed_lesson_ids = set(
            UserLessonHistory.objects.filter(
                user=user, lesson__unit=unit
            ).values_list("lesson_id", flat=True)
        )

        all_lessons = list(unit.lessons.all().order_by("order"))
        if not all_lessons:
            raise ValidationException(
                "No lessons found for this unit.", code="NOT_FOUND", status_code=404
            )

        next_lesson = None
        for lesson in all_lessons:
            if lesson.id not in completed_lesson_ids:
                next_lesson = lesson
                break

        if not next_lesson:
            next_lesson = all_lessons[0]

        exercises = list(next_lesson.exercises.all().order_by("order"))

        return {
            "lesson": {
                "id": str(next_lesson.id),
                "title": next_lesson.title,
                "order": next_lesson.order,
                "xp_reward": next_lesson.xp_reward,
                "unit": {
                    "id": str(unit.id),
                    "title": unit.title,
                },
                "exercises": [
                    {
                        "id": str(ex.id),
                        "exercise_type": ex.exercise_type,
                        "prompt": ex.prompt,
                        "audio_url": ex.audio_url,
                        "content_json": ex.content_json,
                        "order": ex.order,
                    }
                    for ex in exercises
                ],
            }
        }

    @staticmethod
    def submit_exercise(user: User, exercise_id, user_answer: any) -> dict:
        """
        Evaluates an exercise submission and deducts a heart if incorrect.
        """
        exercise = (
            Exercise.objects.filter(id=exercise_id)
            .select_related("lesson", "lesson__unit", "lesson__unit__section", "lesson__unit__section__course")
            .first()
        )
        if not exercise:
            raise ValidationException("Exercise not found.", code="NOT_FOUND", status_code=404)

        unit = exercise.lesson.unit
        course = unit.section.course

        is_enrolled = UserCourse.objects.filter(user=user, course=course).exists()
        if not is_enrolled:
            raise ValidationException(
                "You are not enrolled in this course.", code="NOT_ENROLLED", status_code=403
            )

        progress = UserUnitProgress.objects.filter(user=user, unit=unit).first()
        is_first_unit = unit.section.order == 1 and unit.order == 1
        is_unlocked = progress.is_unlocked if progress else is_first_unit

        if not is_unlocked:
            raise ValidationException(
                "This skill/unit is locked.", code="UNIT_LOCKED", status_code=403
            )

        is_correct, correct_answer_display = ExerciseAnswerService.check(
            exercise, user_answer
        )

        with transaction.atomic():
            user_refreshed = User.objects.select_for_update().get(pk=user.pk)

            if not is_correct:
                UserService.deduct_heart(user_refreshed)
                user_refreshed.refresh_from_db(fields=["hearts"])

            return {
                "is_correct": is_correct,
                "feedback": {
                    "type": "CORRECT" if is_correct else "INCORRECT",
                    "message": "Great job!" if is_correct else "Not quite.",
                },
                "correct_answer": correct_answer_display,
                "hearts_remaining": user_refreshed.hearts,
                "is_out_of_hearts": user_refreshed.hearts <= 0,
            }

    @staticmethod
    def complete_lesson(user: User, lesson_id, payload: dict | None = None) -> dict:
        """
        Completes a lesson atomically, awarding XP, updating streak/progress, and unlocking next units.
        Idempotent for replay completions.
        """
        lesson = (
            Lesson.objects.filter(id=lesson_id)
            .select_related("unit", "unit__section", "unit__section__course")
            .first()
        )
        if not lesson:
            raise ValidationException("Lesson not found.", code="NOT_FOUND", status_code=404)

        unit = lesson.unit
        course = unit.section.course

        is_enrolled = UserCourse.objects.filter(user=user, course=course).exists()
        if not is_enrolled:
            raise ValidationException(
                "You are not enrolled in this course.", code="NOT_ENROLLED", status_code=403
            )

        with transaction.atomic():
            user_refreshed = User.objects.select_for_update().get(pk=user.pk)
            unit_progress, _ = UserUnitProgress.objects.select_for_update().get_or_create(
                user=user_refreshed,
                unit=unit,
                defaults={"is_unlocked": True},
            )

            already_completed = UserLessonHistory.objects.filter(
                user=user_refreshed, lesson=lesson
            ).exists()

            xp_earned = lesson.xp_reward if not already_completed else 0

            total_exercises = lesson.exercises.count()
            history = UserLessonHistory.objects.create(
                user=user_refreshed,
                lesson=lesson,
                xp_earned=xp_earned,
                hearts_lost=0,
                correct_answers=total_exercises,
                total_questions=total_exercises,
            )

            next_unit_unlocked = False

            # Always record activity & update streak on lesson completion
            UserService.record_activity(user_refreshed)

            if not already_completed:
                UserService.add_xp(user_refreshed, xp_earned)

                unit_progress.completed_lessons += 1
                total_unit_lessons = unit.lessons.count()

                if unit_progress.completed_lessons >= total_unit_lessons:
                    unit_progress.completed_lessons = total_unit_lessons
                    unit_progress.is_completed = True
                    unit_progress.crown_level += 1

                    # Unlock next unit in sequence
                    next_unit = (
                        Unit.objects.filter(
                            section=unit.section, order=unit.order + 1
                        ).first()
                    )
                    if not next_unit:
                        next_section = (
                            Section.objects.filter(
                                course=course, order=unit.section.order + 1
                            ).first()
                        )
                        if next_section:
                            next_unit = (
                                Unit.objects.filter(section=next_section)
                                .order_by("order")
                                .first()
                            )

                    if next_unit:
                        next_prog, _ = UserUnitProgress.objects.select_for_update().get_or_create(
                            user=user_refreshed,
                            unit=next_unit,
                            defaults={"is_unlocked": True},
                        )
                        if not next_prog.is_unlocked:
                            next_prog.is_unlocked = True
                            next_prog.save(update_fields=["is_unlocked", "updated_at"])
                        next_unit_unlocked = True

                unit_progress.save()

                # Check achievements
                from gamification.services import AchievementService
                AchievementService.check_and_award(user_refreshed)

            user_refreshed.refresh_from_db()

            return {
                "lesson_history_id": str(history.id),
                "xp_earned": xp_earned,
                "xp_awarded": xp_earned,
                "total_xp": user_refreshed.xp,
                "streak": user_refreshed.streak_count,
                "streak_count": user_refreshed.streak_count,
                "hearts_remaining": user_refreshed.hearts,
                "next_unit_unlocked": next_unit_unlocked,
                "is_replay": already_completed,
                "unit_progress": {
                    "completed_lessons": unit_progress.completed_lessons,
                    "total_lessons": unit.lessons.count(),
                    "is_completed": unit_progress.is_completed,
                    "crown_level": unit_progress.crown_level,
                },
            }

