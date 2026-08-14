import uuid

from django.db import models


class Character(models.Model):
    """
    Mascot/character that can be displayed on sections or units.
    """

    name = models.CharField(
        max_length=100,
        unique=True,
    )

    image_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
    )

    class Meta:
        db_table = "characters"

    def __str__(self):
        return self.name


class UnitIcon(models.Model):
    """
    Reusable icon that can be displayed for a unit.
    """

    name = models.CharField(
        max_length=100,
        unique=True,
    )

    icon_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
    )

    class Meta:
        db_table = "unit_icons"

    def __str__(self):
        return self.name


class Course(models.Model):
    """
    Language course.

    Example:
        English → Spanish
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
        help_text="Language spoken by the learner, e.g. English.",
    )

    target_language = models.CharField(
        max_length=50,
        help_text="Language being learned, e.g. Spanish.",
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


class Section(models.Model):
    """
    Major section of a course.

    Example:
        Section 1: Basics
        Section 2: Food
        Section 3: Travel
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="sections",
    )

    title = models.CharField(
        max_length=150,
    )

    character = models.ForeignKey(
        Character,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sections",
    )

    # Content displayed on the section card/path.
    target_language = models.TextField()

    transliteration = models.TextField(
        blank=True,
    )

    order = models.PositiveIntegerField(
        help_text="Position of this section within the course.",
    )

    color_hex = models.CharField(
        max_length=7,
        default="#58CC02",
        help_text="Hex color used for section UI styling.",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "sections"
        ordering = ["order"]

        constraints = [
            models.UniqueConstraint(
                fields=["course", "order"],
                name="unique_section_order_per_course",
            ),
        ]

    def __str__(self):
        return (
            f"{self.course.title} - "
            f"Section {self.order}: "
            f"{self.title}"
        )


class Unit(models.Model):
    """
    Individual node/skill on the learning path.

    A section contains multiple units, and each unit contains
    lessons.
    """

    class UnitType(models.TextChoices):
        LESSON = "LESSON", "Lesson"
        REVIEW = "REVIEW", "Review"
        LEGENDARY = "LEGENDARY", "Legendary"
        STORY = "STORY", "Story"
        REWARD = "REWARD", "Reward"
        MILESTONE = "MILESTONE", "Milestone"
        CHECKPOINT = "CHECKPOINT", "Checkpoint"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="units",
    )

    title = models.CharField(
        max_length=100,
    )

    description = models.TextField(
        blank=True,
    )

    icon = models.ForeignKey(
        UnitIcon,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="units",
    )

    character = models.ForeignKey(
        Character,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="units",
    )

    unit_type = models.CharField(
        max_length=20,
        choices=UnitType.choices,
        default=UnitType.LESSON,
    )

    order = models.PositiveIntegerField(
        help_text="Position of this unit within the section.",
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

        constraints = [
            models.UniqueConstraint(
                fields=["section", "order"],
                name="unique_unit_order_per_section",
            ),
        ]

    def __str__(self):
        return (
            f"{self.section.title} - "
            f"Unit {self.order}: "
            f"{self.title}"
        )