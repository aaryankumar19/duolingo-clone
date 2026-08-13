import json

from django.test import Client, TestCase
from django.urls import reverse

from gamification.models import Achievement, UserAchievement
from gamification.services import AchievementService, GamificationService
from users.models import DailyActivity, User
from users.services import SessionService


class GamificationTestCase(TestCase):

    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create(
            email="user1@example.com",
            username="user1",
            xp=150,
            streak_count=7,
        )
        self.user2 = User.objects.create(
            email="user2@example.com",
            username="user2",
            xp=50,
            streak_count=2,
        )
        self.token1 = SessionService.create_session(self.user1)
        self.auth_headers1 = {"HTTP_AUTHORIZATION": f"Bearer {self.token1}"}

        self.ach_streak = Achievement.objects.create(
            code="STREAK_7",
            title="Wildfire",
            description="7 day streak",
            target_value=7,
        )
        self.ach_xp = Achievement.objects.create(
            code="XP_100",
            title="Overachiever",
            description="100 XP",
            target_value=100,
        )

    def test_leaderboard_all_time(self):
        url = reverse("leaderboard:detail") + "?timeframe=all_time"
        response = self.client.get(url, **self.auth_headers1)
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        leaderboard = res_data["data"]["leaderboard"]
        self.assertEqual(len(leaderboard), 2)
        self.assertEqual(leaderboard[0]["username"], "user1")
        self.assertEqual(leaderboard[0]["xp"], 150)

    def test_achievement_auto_award(self):
        awarded = AchievementService.check_and_award(self.user1)
        self.assertEqual(len(awarded), 2)
        self.assertTrue(
            UserAchievement.objects.filter(user=self.user1, achievement=self.ach_streak).exists()
        )
        self.assertTrue(
            UserAchievement.objects.filter(user=self.user1, achievement=self.ach_xp).exists()
        )

        # Calling again does not duplicate
        awarded_retry = AchievementService.check_and_award(self.user1)
        self.assertEqual(len(awarded_retry), 0)

    def test_achievement_list_api(self):
        AchievementService.check_and_award(self.user1)

        url = reverse("achievements:list")
        response = self.client.get(url, **self.auth_headers1)
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        achievements = res_data["data"]["achievements"]
        self.assertEqual(len(achievements), 2)
        self.assertTrue(all(a["is_unlocked"] for a in achievements))
