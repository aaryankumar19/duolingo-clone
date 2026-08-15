from django.contrib import admin

from common.admin import ReadOnlyDemoAdminMixin
from .models import Achievement, UserAchievement


@admin.register(Achievement)
class AchievementAdmin(ReadOnlyDemoAdminMixin, admin.ModelAdmin):
    list_display = (
        "title",
        "code",
        "target_value",
        "created_at",
    )
    search_fields = ("title", "code", "description")
    list_filter = ("created_at",)
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(UserAchievement)
class UserAchievementAdmin(ReadOnlyDemoAdminMixin, admin.ModelAdmin):
    list_display = ("user", "achievement", "unlocked_at")
    search_fields = ("user__username", "user__email", "achievement__title", "achievement__code")
    list_filter = ("unlocked_at",)
    ordering = ("-unlocked_at",)
