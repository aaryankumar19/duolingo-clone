import uuid

from django.db import models
from courses.models import Skill


class Lesson(models.Model):
    """
    Individual lesson session containing a sequence of exercises.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name="lessons",
    )

    title = models.CharField(
        max_length=100,
    )

    order = models.PositiveIntegerField(
        help_text="Sequence index of lesson inside skill.",
    )

    xp_reward = models.PositiveIntegerField(
        default=10,
        help_text="XP awarded upon full lesson completion.",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "lessons"
        ordering = ["order"]
        unique_together = ("skill", "order")

    def __str__(self):
        return f"{self.skill.title} - Lesson {self.order}"


class Exercise(models.Model):
    """
    Individual interactive exercise/question within a lesson.
    Supports: Multiple Choice, Translate (Word Bank), Match Pairs, Fill Blank, Type Answer.
    """

    class ExerciseType(models.TextChoices):
        MULTIPLE_CHOICE = "MULTIPLE_CHOICE", "Multiple Choice"
        TRANSLATE = "TRANSLATE", "Translate / Word Bank"
        MATCH_PAIRS = "MATCH_PAIRS", "Match Pairs"
        FILL_IN_BLANK = "FILL_IN_BLANK", "Fill in the Blank"
        TYPE_ANSWER = "TYPE_ANSWER", "Type Answer"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="exercises",
    )

    exercise_type = models.CharField(
        max_length=30,
        choices=ExerciseType.choices,
    )

    prompt = models.TextField(
        help_text="Question prompt (e.g., 'Translate this sentence' or 'Select the correct image').",
    )

    audio_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Optional audio clip for pronunciation/listening exercises.",
    )

    content_json = models.JSONField(
        help_text="Dynamic payload storing choices, word bank items, options, or matching pairs.",
    )

    correct_answer = models.JSONField(
        help_text="Expected correct answer payload (string, array of strings, or key-value object).",
    )

    order = models.PositiveIntegerField(
        help_text="Sequence index inside the lesson player queue.",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "exercises"
        ordering = ["order"]
        unique_together = ("lesson", "order")

    def __str__(self):
        return f"{self.lesson.title} - Ex {self.order} ({self.exercise_type})"
