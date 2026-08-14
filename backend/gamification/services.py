from datetime import timedelta
from django.db.models import Sum
from django.utils import timezone

from progress.models import UserLessonHistory
from users.models import DailyActivity, User
from .models import Achievement, UserAchievement


class GamificationService:

    @staticmethod
    def get_leaderboard(timeframe: str = "weekly") -> list[dict]:
        """
        Returns weekly or all-time leaderboard rankings.
        """
        if timeframe == "all_time":
            users = User.objects.order_by("-xp")[:50]
            return [
                {
                    "rank": idx + 1,
                    "user_id": str(user.id),
                    "username": user.username,
                    "avatar_url": user.avatar_url,
                    "xp": user.xp,
                }
                for idx, user in enumerate(users)
            ]

        # Weekly timeframe: current calendar week starting Monday 00:00 local time
        today = timezone.localdate()
        start_of_week = today - timedelta(days=today.weekday())

        weekly_rankings = (
            DailyActivity.objects.filter(date__gte=start_of_week)
            .values("user_id", "user__username", "user__avatar_url")
            .annotate(weekly_xp=Sum("xp_gained"))
            .order_by("-weekly_xp")[:50]
        )

        leaderboard = []
        for idx, item in enumerate(weekly_rankings):
            leaderboard.append(
                {
                    "rank": idx + 1,
                    "user_id": str(item["user_id"]),
                    "username": item["user__username"],
                    "avatar_url": item["user__avatar_url"],
                    "xp": item["weekly_xp"],
                }
            )

        return leaderboard

    @staticmethod
    def get_achievements(user: User) -> list[dict]:
        """
        Returns all achievement definitions and their unlock status for the given user.
        """
        achievements = Achievement.objects.all().order_by("title")
        unlocked_map = {
            ua.achievement_id: ua.unlocked_at
            for ua in UserAchievement.objects.filter(user=user)
        }

        result = []
        for ach in achievements:
            unlocked_at = unlocked_map.get(ach.id)
            result.append(
                {
                    "id": str(ach.id),
                    "code": ach.code,
                    "title": ach.title,
                    "description": ach.description,
                    "badge_icon_url": ach.badge_icon_url,
                    "target_value": ach.target_value,
                    "is_unlocked": unlocked_at is not None,
                    "unlocked_at": unlocked_at.isoformat() if unlocked_at else None,
                }
            )

        return result


class AchievementService:

    @staticmethod
    def check_and_award(user: User) -> list[Achievement]:
        """
        Evaluates user stats against achievement conditions and awards unlocked achievements.
        """
        achievements = Achievement.objects.all()
        already_unlocked_ids = set(
            UserAchievement.objects.filter(user=user).values_list(
                "achievement_id", flat=True
            )
        )

        completed_lessons_count = UserLessonHistory.objects.filter(user=user).count()
        newly_awarded = []

        for ach in achievements:
            if ach.id in already_unlocked_ids:
                continue

            unlocked = False
            code_upper = ach.code.upper()

            if "STREAK" in code_upper:
                unlocked = user.streak_count >= ach.target_value
            elif "XP" in code_upper:
                unlocked = user.xp >= ach.target_value
            elif "LESSON" in code_upper or "SHARPSHOOTER" in code_upper:
                unlocked = completed_lessons_count >= ach.target_value

            if unlocked:
                UserAchievement.objects.get_or_create(
                    user=user,
                    achievement=ach,
                )
                newly_awarded.append(ach)

        return newly_awarded
