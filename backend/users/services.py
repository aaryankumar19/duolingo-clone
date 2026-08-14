import hashlib
import re
import secrets
import uuid
from datetime import timedelta

from django.contrib.auth.hashers import check_password, make_password
from django.db import IntegrityError, transaction
from django.db.models import F, Q
from django.utils import timezone

from common.exceptions import (
    AuthenticationException,
    ConflictException,
    ValidationException,
)
from progress.models import UserUnitProgress
from .models import DailyActivity, Session, User


class AuthService:

    @staticmethod
    @transaction.atomic
    def register(
        *,
        email: str,
        password: str,
        age: int | None = None,
        name: str | None = None,
    ) -> User:
        try:
            base_name = name.strip() if name else email.split("@")[0]
            sanitized_base = re.sub(r"[^\w]", "", base_name.lower()) or "user"
            unique_suffix = uuid.uuid4().hex[:6]
            generated_username = f"{sanitized_base[:40]}_{unique_suffix}"

            user = User(
                email=email,
                username=generated_username,
                age=age,
            )
            AuthService.set_password(user, password)
            user.save()
        except IntegrityError as exc:
            raise ConflictException(
                "An account with these credentials already exists."
            ) from exc

        return user

    @staticmethod
    def authenticate(
        *,
        identifier: str,
        password: str,
    ) -> User:
        user = User.objects.filter(
            Q(email__iexact=identifier) | Q(username__iexact=identifier)
        ).first()

        if not user or not AuthService.check_password(user, password):
            raise AuthenticationException(
                "Invalid email/username or password."
            )

        return user

    @staticmethod
    def set_password(user: User, raw_password: str) -> None:
        user.password_hash = make_password(raw_password, hasher="argon2")

    @staticmethod
    def check_password(user: User, raw_password: str) -> bool:
        if not user.password_hash:
            return False
        return check_password(raw_password, user.password_hash)


class UserService:

    @staticmethod
    def deduct_heart(user: User) -> bool:
        now = timezone.now()

        updated = (
            User.objects.filter(
                pk=user.pk,
                hearts__gt=0,
            ).update(
                hearts=F("hearts") - 1,
                last_heart_loss_at=now,
                updated_at=now,
            )
        )

        if updated == 0:
            return False

        user.refresh_from_db(
            fields=[
                "hearts",
                "last_heart_loss_at",
                "updated_at",
            ]
        )
        return True

    @staticmethod
    def refill_hearts(user: User) -> None:
        now = timezone.now()

        User.objects.filter(pk=user.pk).update(
            hearts=F("max_hearts"),
            updated_at=now,
        )

        user.refresh_from_db(
            fields=[
                "hearts",
                "max_hearts",
                "updated_at",
            ]
        )

    @staticmethod
    def refill_hearts_with_gems(user: User) -> dict:
        """
        Deducts 100 gems to refill hearts to max_hearts atomically.
        """
        with transaction.atomic():
            user_refreshed = User.objects.select_for_update().get(pk=user.pk)

            if user_refreshed.hearts >= user_refreshed.max_hearts:
                raise ValidationException(
                    "Your hearts are already full.",
                    code="HEARTS_ALREADY_FULL",
                    status_code=400,
                )

            if user_refreshed.gems < 100:
                raise ValidationException(
                    "You need at least 100 gems to refill hearts.",
                    code="INSUFFICIENT_GEMS",
                    status_code=400,
                )

            user_refreshed.gems = F("gems") - 100
            user_refreshed.hearts = F("max_hearts")
            user_refreshed.save(update_fields=["gems", "hearts", "updated_at"])

            user_refreshed.refresh_from_db(fields=["gems", "hearts", "max_hearts"])

            return {
                "hearts": user_refreshed.hearts,
                "max_hearts": user_refreshed.max_hearts,
                "gems": user_refreshed.gems,
            }

    @staticmethod
    def update_streak(user: User) -> None:
        today = timezone.localdate()

        if user.last_active_date == today:
            return

        if user.last_active_date == today - timedelta(days=1):
            new_streak = user.streak_count + 1
        else:
            new_streak = 1

        user.streak_count = new_streak
        user.last_active_date = today

        user.save(
            update_fields=[
                "streak_count",
                "last_active_date",
                "updated_at",
            ]
        )

    @staticmethod
    def add_xp(user: User, amount: int) -> None:
        if amount < 0:
            raise ValueError("XP amount cannot be negative.")

        if amount == 0:
            return

        today = timezone.localdate()
        now = timezone.now()

        with transaction.atomic():
            User.objects.filter(pk=user.pk).update(
                xp=F("xp") + amount,
                updated_at=now,
            )

            activity, _ = DailyActivity.objects.get_or_create(
                user_id=user.pk,
                date=today,
                defaults={
                    "xp_gained": 0,
                },
            )

            DailyActivity.objects.filter(pk=activity.pk).update(
                xp_gained=F("xp_gained") + amount,
                updated_at=now,
            )

        user.refresh_from_db(
            fields=[
                "xp",
                "updated_at",
            ]
        )

    @staticmethod
    def record_activity(user: User) -> None:
        today = timezone.localdate()

        UserService.update_streak(user)

        DailyActivity.objects.get_or_create(
            user_id=user.pk,
            date=today,
        )

    @staticmethod
    def get_profile(user: User) -> dict:
        completed_skills_count = UserUnitProgress.objects.filter(
            user=user, is_completed=True
        ).count()

        return {
            "user": {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "avatar_url": user.avatar_url,
                "age": user.age,
                "xp": user.xp,
                "gems": user.gems,
                "hearts": user.hearts,
                "streak": user.streak_count,
                "streak_count": user.streak_count,
                "created_at": user.created_at.isoformat(),
            },
            "username": user.username,
            "email": user.email,
            "xp": user.xp,
            "gems": user.gems,
            "hearts": user.hearts,
            "streak": user.streak_count,
            "streak_count": user.streak_count,
            "completed_skills_count": completed_skills_count,
            "stats": {
                "xp": user.xp,
                "streak": user.streak_count,
                "streak_count": user.streak_count,
                "gems": user.gems,
                "hearts": user.hearts,
                "max_hearts": user.max_hearts,
                "completed_skills_count": completed_skills_count,
            },
        }

    @staticmethod
    def get_today_activity(user: User) -> dict:
        today = timezone.localdate()
        activity = DailyActivity.objects.filter(user=user, date=today).first()
        xp_gained = activity.xp_gained if activity else 0
        xp_goal = 10

        return {
            "date": today.isoformat(),
            "xp_gained": xp_gained,
            "xp_today": xp_gained,
            "xp_goal": xp_goal,
            "daily_goal": xp_goal,
            "progress": round(min(xp_gained / xp_goal, 1.0), 2),
            "goal_completed": xp_gained >= xp_goal,
        }

    @staticmethod
    def get_activity_history(user: User, days: int = 7) -> list[dict]:
        today = timezone.localdate()
        start_date = today - timedelta(days=days - 1)
        activities = DailyActivity.objects.filter(
            user=user, date__gte=start_date, date__lte=today
        ).order_by("date")

        activity_map = {a.date: a.xp_gained for a in activities}

        res = []
        curr = start_date
        while curr <= today:
            res.append(
                {
                    "date": curr.isoformat(),
                    "xp_gained": activity_map.get(curr, 0),
                }
            )
            curr += timedelta(days=1)
        return res


class SessionService:

    @staticmethod
    def hash_token(raw_token: str) -> str:
        return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()

    @staticmethod
    def create_session(user: User, ttl_days: int = 7) -> str:
        raw_token = secrets.token_urlsafe(32)
        token_hash = SessionService.hash_token(raw_token)
        expires_at = timezone.now() + timedelta(days=ttl_days)

        Session.objects.create(
            session_token_hash=token_hash,
            user=user,
            expires_at=expires_at,
        )

        return raw_token

    @staticmethod
    def is_valid(session: Session) -> bool:
        return (
            session.revoked_at is None
            and session.expires_at > timezone.now()
        )

    @staticmethod
    def revoke(session: Session) -> None:
        session.revoked_at = timezone.now()
        session.save(
            update_fields=[
                "revoked_at",
            ]
        )

    @staticmethod
    def get_session_by_raw_token(raw_token: str) -> Session:
        if not raw_token:
            raise AuthenticationException("Authentication token is required.")

        token_hash = SessionService.hash_token(raw_token)
        session = Session.objects.filter(session_token_hash=token_hash).select_related("user").first()

        if not session or not SessionService.is_valid(session):
            raise AuthenticationException("Invalid or expired session token.")

        return session

    @staticmethod
    def revoke_all_for_user(user: User) -> None:
        now = timezone.now()
        Session.objects.filter(user=user, revoked_at__isnull=True).update(revoked_at=now)
