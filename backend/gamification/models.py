import uuid

from django.db import models
from users.models import User


class Achievement(models.Model):
    """
    Achievement badge definition (e.g., Wildfire for streaks, Sharpshooter for perfect lessons).
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        help_text="Unique identifier key (e.g., STREAK_7, TOTAL_XP_1000).",
    )

    title = models.CharField(
        max_length=100,
    )

    description = models.TextField()

    badge_icon_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
    )

    target_value = models.PositiveIntegerField(
        help_text="Target threshold needed to unlock (e.g., 7 for a 7-day streak).",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "achievements"

    def __str__(self):
        return f"{self.title} ({self.code})"


class UserAchievement(models.Model):
    """
    Junction table mapping unlocked achievements to users.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="achievements",
    )

    achievement = models.ForeignKey(
        Achievement,
        on_delete=models.CASCADE,
        related_name="user_unlocks",
    )

    unlocked_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        db_table = "user_achievements"
        ordering = ["-unlocked_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "achievement"],
                name="unique_user_achievement",
            ),
        ]

    def __str__(self):
        return f"{self.user.username} unlocked {self.achievement.title}"
