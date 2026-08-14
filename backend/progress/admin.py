from django.contrib import admin
from .models import UserLessonHistory


@admin.register(UserLessonHistory)
class UserLessonHistoryAdmin(admin.ModelAdmin):
    list_display = ("user", "lesson", "xp_earned", "hearts_lost", "completed_at")
    search_fields = ("user__username", "user__email", "lesson__title")
    list_filter = ("completed_at",)
