import uuid

from django.db import models

from courses.models import Unit


class Lesson(models.Model):
    """
    Individual lesson containing an ordered sequence of exercises.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    unit = models.ForeignKey(
        Unit,
        on_delete=models.CASCADE,
        related_name="lessons",
    )

    title = models.CharField(
        max_length=100,
    )

    order = models.PositiveIntegerField(
        help_text="Sequence of the lesson within the unit.",
    )

    xp_reward = models.PositiveIntegerField(
        default=10,
        help_text="XP awarded when the lesson is completed.",
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

        constraints = [
            models.UniqueConstraint(
                fields=["unit", "order"],
                name="unique_lesson_order_per_unit",
            ),
        ]

    def __str__(self):
        return (
            f"{self.unit.title} - "
            f"Lesson {self.order}: "
            f"{self.title}"
        )


class Exercise(models.Model):
    """
    Individual exercise/question within a lesson.

    The exercise type determines the structure of content_json
    and correct_answer.
    """

    class ExerciseType(models.TextChoices):
        MULTIPLE_CHOICE = (
            "MULTIPLE_CHOICE",
            "Multiple Choice",
        )

        TRANSLATE = (
            "TRANSLATE",
            "Translate / Word Bank",
        )

        MATCH_PAIRS = (
            "MATCH_PAIRS",
            "Match Pairs",
        )

        FILL_IN_BLANK = (
            "FILL_IN_BLANK",
            "Fill in the Blank",
        )

        TYPE_ANSWER = (
            "TYPE_ANSWER",
            "Type Answer",
        )

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
        help_text="Question or instruction shown to the learner.",
    )

    audio_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Optional audio used by listening/pronunciation exercises.",
    )

    content_json = models.JSONField(
        help_text=(
            "Exercise-specific data such as options, "
            "word bank items, or matching pairs."
        ),
    )

    correct_answer = models.JSONField(
        help_text=(
            "Canonical correct answer used by the backend "
            "when validating submissions."
        ),
    )

    order = models.PositiveIntegerField(
        help_text="Sequence of the exercise within the lesson.",
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

        constraints = [
            models.UniqueConstraint(
                fields=["lesson", "order"],
                name="unique_exercise_order_per_lesson",
            ),
        ]

    def __str__(self):
        return (
            f"{self.lesson.title} - "
            f"Exercise {self.order} "
            f"({self.exercise_type})"
        )