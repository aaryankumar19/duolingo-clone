import json
from datetime import timedelta
from django.test import Client, TestCase
from django.urls import reverse
from django.utils import timezone

from common.exceptions import (
    AuthenticationException,
    ConflictException,
    ValidationException,
)
from .models import DailyActivity, Session, User
from .services import AuthService, SessionService, UserService
from .validators import LoginValidator, LogoutValidator, RegisterValidator


class UserServiceTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            email="testuser@example.com",
            username="testuser_123456",
        )

    def test_password_service(self):
        AuthService.set_password(self.user, "securepassword123")
        self.assertTrue(self.user.password_hash.startswith("argon2"))
        self.assertTrue(AuthService.check_password(self.user, "securepassword123"))
        self.assertFalse(AuthService.check_password(self.user, "wrongpassword"))

    def test_deduct_and_refill_hearts(self):
        self.assertEqual(self.user.hearts, 5)

        # Deduct heart
        success = UserService.deduct_heart(self.user)
        self.assertTrue(success)
        self.assertEqual(self.user.hearts, 4)

        # Deduct remaining hearts down to 0
        for _ in range(4):
            UserService.deduct_heart(self.user)

        self.assertEqual(self.user.hearts, 0)
        self.assertFalse(UserService.deduct_heart(self.user))

        # Refill hearts
        UserService.refill_hearts(self.user)
        self.assertEqual(self.user.hearts, 5)

    def test_update_user_streak(self):
        today = timezone.localdate()
        yesterday = today - timedelta(days=1)
        two_days_ago = today - timedelta(days=2)

        # Active yesterday -> streak increments to 1 then 2
        self.user.last_active_date = yesterday
        self.user.streak_count = 1
        self.user.save()

        UserService.update_streak(self.user)
        self.assertEqual(self.user.streak_count, 2)
        self.assertEqual(self.user.last_active_date, today)

        # Calling again on same day should be no-op
        UserService.update_streak(self.user)
        self.assertEqual(self.user.streak_count, 2)

        # Active 2 days ago -> streak resets to 1
        self.user.last_active_date = two_days_ago
        self.user.save()

        UserService.update_streak(self.user)
        self.assertEqual(self.user.streak_count, 1)

    def test_add_user_xp(self):
        UserService.add_xp(self.user, 50)
        self.assertEqual(self.user.xp, 50)

        today = timezone.localdate()
        activity = DailyActivity.objects.get(user=self.user, date=today)
        self.assertEqual(activity.xp_gained, 50)

        # Add more XP
        UserService.add_xp(self.user, 30)
        self.assertEqual(self.user.xp, 80)
        activity.refresh_from_db()
        self.assertEqual(activity.xp_gained, 80)

        # Negative XP raises ValueError
        with self.assertRaises(ValueError):
            UserService.add_xp(self.user, -10)

    def test_record_user_activity(self):
        UserService.record_activity(self.user)
        today = timezone.localdate()

        self.assertEqual(self.user.streak_count, 1)
        self.assertEqual(self.user.last_active_date, today)
        self.assertTrue(
            DailyActivity.objects.filter(user=self.user, date=today).exists()
        )

    def test_session_services(self):
        raw_token = SessionService.create_session(self.user, ttl_days=7)
        self.assertIsNotNone(raw_token)
        session = Session.objects.get(
            session_token_hash=SessionService.hash_token(raw_token)
        )
        self.assertEqual(session.user, self.user)

        # Check validity
        self.assertTrue(SessionService.is_valid(session))

        # Revoke session
        SessionService.revoke(session)
        self.assertFalse(SessionService.is_valid(session))


class AuthArchitectureTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_register_validator_valid(self):
        payload = {
            "email": "  NEWUSER@Domain.com ",
            "password": "supersecretpassword",
            "age": 22,
            "name": "New Learner",
        }
        validated = RegisterValidator.validate(payload)
        self.assertEqual(validated["email"], "newuser@domain.com")
        self.assertEqual(validated["name"], "New Learner")
        self.assertEqual(validated["age"], 22)
        self.assertNotIn("username", validated)

    def test_register_validator_invalid_email(self):
        payload = {
            "email": "invalid-email",
            "password": "supersecretpassword",
            "age": 20,
        }
        with self.assertRaises(ValidationException):
            RegisterValidator.validate(payload)

    def test_register_service_success_and_duplicate_conflict(self):
        user = AuthService.register(
            email="unique@domain.com",
            password="password123",
            age=25,
            name="Unique Learner",
        )
        self.assertEqual(user.email, "unique@domain.com")
        self.assertTrue(user.username.startswith("uniquelearner_"))
        self.assertEqual(len(user.username.split("_")[-1]), 6)
        self.assertTrue(AuthService.check_password(user, "password123"))

        # Duplicate email raises ConflictException
        with self.assertRaises(ConflictException):
            AuthService.register(
                email="unique@domain.com",
                password="password123",
                age=25,
            )

    def test_register_view_api_success(self):
        url = reverse("users:register")
        payload = {
            "email": "apinetuser@example.com",
            "password": "password12345",
            "age": 20,
        }
        response = self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 201)
        res_data = response.json()
        self.assertEqual(res_data["code"], "USER_REGISTERED")
        self.assertTrue(
            res_data["data"]["user"]["username"].startswith("apinetuser_")
        )
        self.assertIn("auth_token", res_data["data"]["user"])

    def test_register_view_api_validation_error(self):
        url = reverse("users:register")
        payload = {
            "email": "bad-email",
            "password": "123",
            "age": 20,
        }
        response = self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)
        res_data = response.json()
        self.assertEqual(res_data["error"]["code"], "VALIDATION_ERROR")

    def test_login_validator_valid(self):
        payload = {
            "identifier": " user@example.com ",
            "password": "mypassword123",
        }
        validated = LoginValidator.validate(payload)
        self.assertEqual(validated["identifier"], "user@example.com")

    def test_login_service_success_and_failures(self):
        user = AuthService.register(
            email="loginuser@example.com",
            password="mypassword123",
            age=25,
        )

        # Authenticate by email
        auth_by_email = AuthService.authenticate(
            identifier="loginuser@example.com",
            password="mypassword123",
        )
        self.assertEqual(auth_by_email, user)

        # Authenticate by auto-generated username
        auth_by_username = AuthService.authenticate(
            identifier=user.username,
            password="mypassword123",
        )
        self.assertEqual(auth_by_username, user)

        # Failed login: wrong password
        with self.assertRaises(AuthenticationException):
            AuthService.authenticate(
                identifier="loginuser@example.com",
                password="wrongpassword",
            )

        # Failed login: non-existent user
        with self.assertRaises(AuthenticationException):
            AuthService.authenticate(
                identifier="nonexistent@example.com",
                password="mypassword123",
            )

    def test_login_view_api_success(self):
        user = AuthService.register(
            email="api_login@example.com",
            password="password123",
            age=22,
        )
        url = reverse("users:login")

        payload = {
            "identifier": "api_login@example.com",
            "password": "password123",
        }
        response = self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertEqual(res_data["code"], "USER_LOGGED_IN")
        self.assertEqual(res_data["data"]["user"]["username"], user.username)
        self.assertIn("auth_token", res_data["data"]["user"])

    def test_login_view_api_invalid_credentials(self):
        url = reverse("users:login")
        payload = {
            "identifier": "nonexistent@example.com",
            "password": "wrongpassword",
        }
        response = self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)
        res_data = response.json()
        self.assertEqual(res_data["error"]["code"], "INVALID_CREDENTIALS")

    def test_logout_view_single_session(self):
        user = AuthService.register(
            email="logout1@example.com",
            password="password123",
            age=22,
        )
        token1 = SessionService.create_session(user)
        token2 = SessionService.create_session(user)

        url = reverse("users:logout")
        payload = {"clear_all_sessions": False}

        response = self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer {token1}",
        )
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertEqual(res_data["code"], "USER_LOGGED_OUT")
        self.assertFalse(res_data["data"]["cleared_all_sessions"])

        # Token 1 is now invalid/revoked
        session1 = Session.objects.get(
            session_token_hash=SessionService.hash_token(token1)
        )
        self.assertFalse(SessionService.is_valid(session1))

        # Token 2 remains valid
        session2 = Session.objects.get(
            session_token_hash=SessionService.hash_token(token2)
        )
        self.assertTrue(SessionService.is_valid(session2))

    def test_logout_view_all_sessions(self):
        user = AuthService.register(
            email="logoutall@example.com",
            password="password123",
            age=22,
        )
        token1 = SessionService.create_session(user)
        token2 = SessionService.create_session(user)

        url = reverse("users:logout")
        payload = {"clear_all_sessions": True}

        response = self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer {token1}",
        )
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertEqual(res_data["code"], "USER_LOGGED_OUT")
        self.assertTrue(res_data["data"]["cleared_all_sessions"])

        # Both sessions are now revoked
        session1 = Session.objects.get(
            session_token_hash=SessionService.hash_token(token1)
        )
        session2 = Session.objects.get(
            session_token_hash=SessionService.hash_token(token2)
        )
        self.assertFalse(SessionService.is_valid(session1))
        self.assertFalse(SessionService.is_valid(session2))

    def test_logout_view_invalid_token(self):
        url = reverse("users:logout")
        response = self.client.post(
            url,
            data=json.dumps({"clear_all_sessions": False}),
            content_type="application/json",
            HTTP_AUTHORIZATION="Bearer invalidtoken123",
        )
        self.assertEqual(response.status_code, 401)
        res_data = response.json()
        self.assertEqual(res_data["error"]["code"], "INVALID_CREDENTIALS")


class HeartsProfileActivityTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(
            email="hearts@example.com",
            username="hearts_user",
            gems=500,
            hearts=3,
            max_hearts=5,
        )
        self.token = SessionService.create_session(self.user)
        self.auth_headers = {"HTTP_AUTHORIZATION": f"Bearer {self.token}"}

    def test_heart_refill_success(self):
        url = reverse("hearts:refill_gems")
        response = self.client.post(url, **self.auth_headers)
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertEqual(res_data["data"]["hearts"], 5)
        self.assertEqual(res_data["data"]["gems"], 400)

    def test_heart_refill_already_full(self):
        self.user.hearts = 5
        self.user.save()
        url = reverse("hearts:refill_gems")
        response = self.client.post(url, **self.auth_headers)
        self.assertEqual(response.status_code, 400)
        res_data = response.json()
        self.assertEqual(res_data["error"]["code"], "HEARTS_ALREADY_FULL")

    def test_heart_refill_insufficient_gems(self):
        self.user.gems = 50
        self.user.save()
        url = reverse("hearts:refill_gems")
        response = self.client.post(url, **self.auth_headers)
        self.assertEqual(response.status_code, 400)
        res_data = response.json()
        self.assertEqual(res_data["error"]["code"], "INSUFFICIENT_GEMS")

    def test_profile_api(self):
        url = reverse("profile:detail")
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertEqual(res_data["data"]["user"]["username"], "hearts_user")

    def test_activity_today_and_history_api(self):
        url_today = reverse("activity:today")
        response_today = self.client.get(url_today, **self.auth_headers)
        self.assertEqual(response_today.status_code, 200)

        url_hist = reverse("activity:history")
        response_hist = self.client.get(url_hist, **self.auth_headers)
        self.assertEqual(response_hist.status_code, 200)
        self.assertEqual(len(response_hist.json()["data"]["activities"]), 7)
