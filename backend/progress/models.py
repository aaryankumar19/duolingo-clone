import uuid

from django.db import models
from django.utils import timezone
from users.models import User
from courses.models import Skill
from lessons.models import Lesson


class UserSkillProgress(models.Model):
    """
    Tracks a user's progress for a specific skill (unlocked state, completion state).
    """

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="skill_progresses",
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name="user_progresses",
    )

    completed_lessons = models.PositiveIntegerField(
        default=0,
        help_text="Number of lessons completed in this skill.",
    )

    is_unlocked = models.BooleanField(
        default=False,
        help_text="Whether this skill node is accessible to the learner.",
    )

    is_completed = models.BooleanField(
        default=False,
        help_text="Whether all lessons in this skill are completed.",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    pk = models.CompositePrimaryKey("user_id", "skill_id")

    class Meta:
        db_table = "user_skill_progress"

    def __str__(self):
        return (
            f"{self.user.username} - "
            f"{self.skill.title} "
            f"({self.completed_lessons}/{self.skill.total_lessons})"
        )


class UserLessonHistory(models.Model):
    """
    Log history of every lesson completed by a user.
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
        default=10,
    )

    hearts_lost = models.PositiveSmallIntegerField(
        default=0,
    )

    completed_at = models.DateTimeField(
        default=timezone.now,
    )

    class Meta:
        db_table = "user_lesson_history"
        ordering = ["-completed_at"]

    def __str__(self):
        return (
            f"{self.user.username} finished "
            f"{self.lesson.title} (+{self.xp_earned} XP)"
        )
