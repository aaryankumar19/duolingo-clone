import uuid

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class User(models.Model):

    """
    Application user model.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    age = models.SmallIntegerField(
        null=True,
        blank=True,
    )

    
    email = models.EmailField(
        unique=True,
        db_index=True,
    )

    username = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
    )

    # Auth
    password_hash = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text="Null for OAuth users.",
    )

    # Profile
    avatar_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
    )

    # Game
    xp = models.PositiveIntegerField(
        default=0,
        help_text="Total experience points earned.",
    )

    gems = models.PositiveIntegerField(
        default=500,
        help_text="Mocked in-app currency.",
    )

    hearts = models.PositiveSmallIntegerField(
        default=5,
        help_text="Current hearts balance.",
    )

    max_hearts = models.PositiveSmallIntegerField(
        default=5,
        help_text="Maximum allowed hearts.",
    )

    last_heart_loss_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    # Streak
    streak_count = models.PositiveIntegerField(
        default=0,
        help_text="Current daily active streak.",
    )

    last_active_date = models.DateField(
        null=True,
        blank=True,
        help_text="Last date on which the user completed activity.",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "users"
        ordering = ["-xp"]

    def __str__(self):
        return f"{self.username} ({self.email})"


class Session(models.Model):
    """
    Session model for authenticated users.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    session_token_hash = models.CharField(
        max_length=64,
        unique=True,
        db_index=True,
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sessions",
    )

    expires_at = models.DateTimeField(
        db_index=True,
    )

    revoked_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        db_table = "sessions"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Session for {self.user.username}"


class DailyActivity(models.Model):
    """
    Daily activity model tracking daily user progress and XP.
    """

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="daily_activities",
    )

    date = models.DateField(
        default=timezone.localdate,
    )

    xp_gained = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    pk = models.CompositePrimaryKey("user_id", "date")

    class Meta:
        db_table = "user_daily_activity"
        ordering = ["-date"]

    def __str__(self):
        return (
            f"{self.user.username} - "
            f"{self.date}: "
            f"{self.xp_gained} XP"
        )


class UserCourse(models.Model):
    """
    Associates users with the courses they have selected.

    A user may select multiple courses.
    The UserCourse with the most recent updated_at timestamp
    is considered the user's currently active course.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="user_courses",
    )

    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE,
        related_name="user_courses",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Last time the user selected/activated this course.",
    )

    class Meta:
        db_table = "user_courses"
        ordering = ["-updated_at"]

        constraints = [
            models.UniqueConstraint(
                fields=["user", "course"],
                name="unique_user_course",
            ),
        ]

    def __str__(self):
        return (
            f"{self.user.username} - "
            f"{self.course.title}"
        )