from django.db import transaction

from common.exceptions import ValidationException
from progress.models import UserUnitProgress
from users.models import User, UserCourse
from .models import Course, Section, Unit


class CourseService:

    @staticmethod
    def get_all_courses(user: User | None = None) -> list[dict]:
        """
        Returns all active courses along with user enrollment and active flags.
        """
        courses = Course.objects.filter(is_active=True).order_by("title")

        if not user:
            return [
                {
                    "id": str(c.id),
                    "title": c.title,
                    "source_language": c.source_language,
                    "target_language": c.target_language,
                    "flag_icon_url": c.flag_icon_url,
                    "is_enrolled": False,
                    "is_active": False,
                }
                for c in courses
            ]

        user_courses = list(
            UserCourse.objects.filter(user=user).order_by("-updated_at")
        )
        enrolled_ids = {uc.course_id for uc in user_courses}
        active_course_id = user_courses[0].course_id if user_courses else None

        return [
            {
                "id": str(c.id),
                "title": c.title,
                "source_language": c.source_language,
                "target_language": c.target_language,
                "flag_icon_url": c.flag_icon_url,
                "is_enrolled": c.id in enrolled_ids,
                "is_active": c.id == active_course_id,
            }
            for c in courses
        ]

    @staticmethod
    @transaction.atomic
    def select_course(user: User, course_id) -> Course:
        """
        Selects/activates a course for a user and unlocks the first unit if not initialized.
        """
        course = Course.objects.filter(id=course_id, is_active=True).first()
        if not course:
            raise ValidationException("Course not found.", code="NOT_FOUND", status_code=404)

        user_course, _ = UserCourse.objects.get_or_create(
            user=user,
            course=course,
        )
        user_course.save(update_fields=["updated_at"])

        # Check if first unit progress needs initialization
        first_section = (
            Section.objects.filter(course=course).order_by("order").first()
        )
        if first_section:
            first_unit = (
                Unit.objects.filter(section=first_section).order_by("order").first()
            )
            if first_unit:
                UserUnitProgress.objects.get_or_create(
                    user=user,
                    unit=first_unit,
                    defaults={"is_unlocked": True},
                )

        return course

    @staticmethod
    def get_current_course(user: User) -> Course | None:
        """
        Returns the user's currently active course (most recently updated/selected course).
        """
        user_course = (
            UserCourse.objects
            .filter(user=user)
            .select_related("course")
            .order_by("-updated_at")
            .first()
        )
        return user_course.course if user_course else None

    @staticmethod
    def get_current_path(user: User) -> dict | None:
        """
        Retrieves the learning path hierarchy (sections, units, and progress) for the active course.
        """
        course = CourseService.get_current_course(user)
        if not course:
            return None

        sections = (
            Section.objects.filter(course=course)
            .select_related("character")
            .prefetch_related(
                "units__icon",
                "units__character",
                "units__lessons",
            )
            .order_by("order")
        )

        all_unit_ids = [u.id for s in sections for u in s.units.all()]
        progress_map = {
            p.unit_id: p
            for p in UserUnitProgress.objects.filter(
                user=user,
                unit_id__in=all_unit_ids,
            )
        }

        sections_data = []
        for s_idx, section in enumerate(sections):
            units_data = []
            for u_idx, unit in enumerate(section.units.all()):
                total_lessons = unit.lessons.count()
                progress = progress_map.get(unit.id)

                # First unit of first section is unlocked by default if no progress row exists
                is_first_unit = (s_idx == 0 and u_idx == 0)
                if progress:
                    is_unlocked = progress.is_unlocked
                    completed_lessons = progress.completed_lessons
                    is_completed = progress.is_completed
                    crown_level = progress.crown_level
                else:
                    is_unlocked = is_first_unit
                    completed_lessons = 0
                    is_completed = False
                    crown_level = 0

                units_data.append(
                    {
                        "id": str(unit.id),
                        "title": unit.title,
                        "description": unit.description,
                        "unit_type": unit.unit_type,
                        "order": unit.order,
                        "icon": {
                            "name": unit.icon.name,
                            "icon_url": unit.icon.icon_url,
                        } if unit.icon else None,
                        "character": {
                            "name": unit.character.name,
                            "image_url": unit.character.image_url,
                        } if unit.character else None,
                        "total_lessons": total_lessons,
                        "completed_lessons": completed_lessons,
                        "is_unlocked": is_unlocked,
                        "is_completed": is_completed,
                        "crown_level": crown_level,
                    }
                )

            sections_data.append(
                {
                    "id": str(section.id),
                    "title": section.title,
                    "target_language": section.target_language,
                    "transliteration": section.transliteration,
                    "order": section.order,
                    "color_hex": section.color_hex,
                    "character": {
                        "name": section.character.name,
                        "image_url": section.character.image_url,
                    } if section.character else None,
                    "units": units_data,
                }
            )

        return {
            "course": {
                "id": str(course.id),
                "title": course.title,
                "source_language": course.source_language,
                "target_language": course.target_language,
                "flag_icon_url": course.flag_icon_url,
            },
            "sections": sections_data,
        }
