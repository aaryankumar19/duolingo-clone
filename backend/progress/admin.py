from django.contrib import admin

from common.admin import ReadOnlyDemoAdminMixin
from .models import UserLessonHistory, UserUnitProgress


@admin.register(UserUnitProgress)
class UserUnitProgressAdmin(ReadOnlyDemoAdminMixin, admin.ModelAdmin):
    list_display = (
        "user",
        "unit",
        "is_unlocked",
        "completed_lessons",
        "is_completed",
        "crown_level",
        "updated_at",
    )
    search_fields = ("user__username", "user__email", "unit__title")
    list_filter = ("is_unlocked", "is_completed", "crown_level", "updated_at")
    ordering = ("-updated_at",)


@admin.register(UserLessonHistory)
class UserLessonHistoryAdmin(ReadOnlyDemoAdminMixin, admin.ModelAdmin):
    list_display = (
        "user",
        "lesson",
        "xp_earned",
        "hearts_lost",
        "correct_answers",
        "total_questions",
        "completed_at",
    )
    search_fields = ("user__username", "user__email", "lesson__title")
    list_filter = ("completed_at",)
    readonly_fields = ("id", "completed_at")
    ordering = ("-completed_at",)
