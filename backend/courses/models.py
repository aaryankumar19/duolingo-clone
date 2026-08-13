import uuid

from django.db import models


class Course(models.Model):
    """
    Language course model (e.g., Spanish for English speakers).
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    title = models.CharField(
        max_length=100,
    )

    source_language = models.CharField(
        max_length=50,
        help_text="Language the learner speaks (e.g., English).",
    )

    target_language = models.CharField(
        max_length=50,
        help_text="Language being learned (e.g., Spanish).",
    )

    flag_icon_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "courses"

    def __str__(self):
        return f"{self.title} ({self.target_language})"


class Unit(models.Model):
    """
    Unit section on the learning path (e.g., Unit 1: Form basic sentences).
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="units",
    )

    title = models.CharField(
        max_length=150,
    )

    description = models.TextField(
        blank=True,
        null=True,
    )

    order = models.PositiveIntegerField(
        help_text="Position sequence on the course path.",
    )

    color_hex = models.CharField(
        max_length=7,
        default="#58CC02",
        help_text="Hex color code for unit UI styling on path.",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "units"
        ordering = ["order"]
        unique_together = ("course", "order")

    def __str__(self):
        return f"{self.course.title} - Unit {self.order}: {self.title}"


class Skill(models.Model):
    """
    Skill node on the learning path tree (e.g., Intro, Food, Animals).
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    unit = models.ForeignKey(
        Unit,
        on_delete=models.CASCADE,
        related_name="skills",
    )

    title = models.CharField(
        max_length=100,
    )

    description = models.TextField(
        blank=True,
        null=True,
    )

    icon_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
    )

    order = models.PositiveIntegerField(
        help_text="Position sequence within the unit.",
    )

    total_lessons = models.PositiveIntegerField(
        default=3,
        help_text="Total number of lessons required to complete this skill.",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "skills"
        ordering = ["order"]
        unique_together = ("unit", "order")

    def __str__(self):
        return f"{self.unit.title} - Skill {self.order}: {self.title}"
