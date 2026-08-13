from django.contrib import admin
from .models import Session, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "username",
        "email",
        "age",
        "xp",
        "gems",
        "hearts",
        "streak_count",
        "created_at",
    )
    search_fields = (
        "username",
        "email",
    )
    list_filter = (
        "created_at",
        "last_active_date",
    )
    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
    )
    ordering = ("-created_at",)


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "expires_at",
        "revoked_at",
        "created_at",
    )
    search_fields = (
        "user__username",
        "user__email",
        "session_token_hash",
    )
    list_filter = (
        "created_at",
        "expires_at",
        "revoked_at",
    )
    readonly_fields = (
        "id",
        "session_token_hash",
        "created_at",
    )
    ordering = ("-created_at",)
