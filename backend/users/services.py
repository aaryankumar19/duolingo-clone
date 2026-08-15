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
    def sync_passive_hearts(user: User) -> User:
        """
        Synchronizes time-based heart refill (1 heart every 4 hours).
        Updates user in DB if hearts were regenerated.
        """
        if user.hearts >= user.max_hearts:
            if user.last_heart_loss_at is not None:
                user.last_heart_loss_at = None
                user.save(update_fields=["last_heart_loss_at", "updated_at"])
            return user

        now = timezone.now()
        last_loss = user.last_heart_loss_at or user.updated_at or now
        elapsed = now - last_loss
        interval = timedelta(hours=4)

        if elapsed < interval:
            return user

        hearts_gained = int(elapsed // interval)
        if hearts_gained <= 0:
            return user

        with transaction.atomic():
            user_refreshed = User.objects.select_for_update().get(pk=user.pk)
            if user_refreshed.hearts >= user_refreshed.max_hearts:
                return user_refreshed

            curr_last_loss = (
                user_refreshed.last_heart_loss_at or user_refreshed.updated_at or now
            )
            curr_elapsed = now - curr_last_loss
            actual_gained = int(curr_elapsed // interval)
            if actual_gained <= 0:
                return user_refreshed

            new_hearts = min(
                user_refreshed.max_hearts, user_refreshed.hearts + actual_gained
            )
            if new_hearts >= user_refreshed.max_hearts:
                user_refreshed.hearts = user_refreshed.max_hearts
                user_refreshed.last_heart_loss_at = None
            else:
                user_refreshed.hearts = new_hearts
                user_refreshed.last_heart_loss_at = curr_last_loss + (
                    actual_gained * interval
                )

            user_refreshed.save(
                update_fields=["hearts", "last_heart_loss_at", "updated_at"]
            )

            user.hearts = user_refreshed.hearts
            user.last_heart_loss_at = user_refreshed.last_heart_loss_at
            return user_refreshed

    @staticmethod
    def get_heart_refill_info(user: User) -> dict:
        UserService.sync_passive_hearts(user)
        if user.hearts >= user.max_hearts or not user.last_heart_loss_at:
            return {
                "next_heart_refill_at": None,
                "seconds_to_next_heart": None,
            }

        now = timezone.now()
        interval = timedelta(hours=4)
        next_refill_at = user.last_heart_loss_at + interval
        seconds_left = max(0, int((next_refill_at - now).total_seconds()))

        return {
            "next_heart_refill_at": next_refill_at.isoformat(),
            "seconds_to_next_heart": seconds_left,
        }

    @staticmethod
    def deduct_heart(user: User) -> bool:
        UserService.sync_passive_hearts(user)
        now = timezone.now()

        with transaction.atomic():
            user_refreshed = User.objects.select_for_update().get(pk=user.pk)
            if user_refreshed.hearts <= 0:
                return False

            user_refreshed.hearts -= 1
            if user_refreshed.last_heart_loss_at is None:
                user_refreshed.last_heart_loss_at = now

            user_refreshed.save(
                update_fields=["hearts", "last_heart_loss_at", "updated_at"]
            )

            user.hearts = user_refreshed.hearts
            user.last_heart_loss_at = user_refreshed.last_heart_loss_at
            return True

    @staticmethod
    def refill_hearts(user: User) -> None:
        now = timezone.now()

        User.objects.filter(pk=user.pk).update(
            hearts=F("max_hearts"),
            last_heart_loss_at=None,
            updated_at=now,
        )

        user.refresh_from_db(
            fields=[
                "hearts",
                "max_hearts",
                "last_heart_loss_at",
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
            UserService.sync_passive_hearts(user_refreshed)

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
            user_refreshed.last_heart_loss_at = None
            user_refreshed.save(
                update_fields=["gems", "hearts", "last_heart_loss_at", "updated_at"]
            )

            user_refreshed.refresh_from_db(
                fields=["gems", "hearts", "max_hearts", "last_heart_loss_at"]
            )

            return {
                "hearts": user_refreshed.hearts,
                "max_hearts": user_refreshed.max_hearts,
                "gems": user_refreshed.gems,
            }

    @staticmethod
    def sync_streak(user: User) -> None:
        """
        Lazily syncs the user's streak. If the user missed yesterday or earlier,
        resets their streak_count to 0.
        """
        today = timezone.localdate()
        yesterday = today - timedelta(days=1)

        if user.last_active_date is None:
            if user.streak_count != 0:
                user.streak_count = 0
                user.save(update_fields=["streak_count", "updated_at"])
            return

        if user.last_active_date < yesterday:
            if user.streak_count != 0:
                user.streak_count = 0
                user.save(update_fields=["streak_count", "updated_at"])

    @staticmethod
    def update_streak(user: User) -> None:
        today = timezone.localdate()
        yesterday = today - timedelta(days=1)

        UserService.sync_streak(user)

        if user.last_active_date == today:
            return

        if user.last_active_date == yesterday:
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
        UserService.sync_streak(user)
        UserService.sync_passive_hearts(user)
        refill_info = UserService.get_heart_refill_info(user)
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
                "max_hearts": user.max_hearts,
                "next_heart_refill_at": refill_info["next_heart_refill_at"],
                "seconds_to_next_heart": refill_info["seconds_to_next_heart"],
                "streak": user.streak_count,
                "streak_count": user.streak_count,
                "created_at": user.created_at.isoformat(),
            },
            "username": user.username,
            "email": user.email,
            "xp": user.xp,
            "gems": user.gems,
            "hearts": user.hearts,
            "max_hearts": user.max_hearts,
            "next_heart_refill_at": refill_info["next_heart_refill_at"],
            "seconds_to_next_heart": refill_info["seconds_to_next_heart"],
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
                "next_heart_refill_at": refill_info["next_heart_refill_at"],
                "seconds_to_next_heart": refill_info["seconds_to_next_heart"],
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
