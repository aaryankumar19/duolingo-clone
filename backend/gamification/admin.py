from django.contrib import admin
from .models import Achievement


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ("title", "code", "target_value", "created_at")
    search_fields = ("title", "code")
    list_filter = ("created_at",)
