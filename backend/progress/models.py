import uuid

from django.db import models
from django.utils import timezone

from users.models import User
from courses.models import Unit
from lessons.models import Lesson


class UserUnitProgress(models.Model):
    """
    Stores the current progress of a user for a specific unit.

    This represents the user's current state on the learning path:
    - whether the unit is unlocked
    - how many lessons have been completed
    - whether the unit itself is completed
    - current crown/proficiency level
    """

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="unit_progresses",
    )

    unit = models.ForeignKey(
        Unit,
        on_delete=models.CASCADE,
        related_name="user_progresses",
    )

    is_unlocked = models.BooleanField(
        default=False,
        help_text="Whether the user can currently access this unit.",
    )

    completed_lessons = models.PositiveIntegerField(
        default=0,
        help_text="Number of lessons completed in this unit.",
    )

    is_completed = models.BooleanField(
        default=False,
        help_text="Whether all lessons in this unit are completed.",
    )

    crown_level = models.PositiveSmallIntegerField(
        default=0,
        help_text="Current proficiency/crown level for this unit.",
    )

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "user_unit_progress"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "unit"],
                name="unique_user_unit_progress",
            ),
        ]

    def __str__(self):
        return (
            f"{self.user.username} - "
            f"{self.unit.title} "
            f"({self.completed_lessons} lessons, "
            f"crown {self.crown_level})"
        )


class UserLessonHistory(models.Model):
    """
    Records each successfully completed lesson by a user.

    Multiple records for the same user and lesson are allowed,
    because a user may replay a lesson.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="lesson_histories",
    )

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="user_histories",
    )

    xp_earned = models.PositiveIntegerField(
        default=0,
        help_text="XP earned from this lesson completion.",
    )

    hearts_lost = models.PositiveSmallIntegerField(
        default=0,
        help_text="Number of hearts lost during this lesson.",
    )

    correct_answers = models.PositiveSmallIntegerField(
        default=0,
        help_text="Number of exercises answered correctly.",
    )

    total_questions = models.PositiveSmallIntegerField(
        default=0,
        help_text="Total number of exercises in the lesson.",
    )

    completed_at = models.DateTimeField(
        default=timezone.now,
        db_index=True,
    )

    class Meta:
        db_table = "user_lesson_history"
        ordering = ["-completed_at"]

    def __str__(self):
        return (
            f"{self.user.username} finished "
            f"{self.lesson.title} "
            f"(+{self.xp_earned} XP)"
        )