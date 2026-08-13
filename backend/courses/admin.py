from django.contrib import admin
from .models import Course, Skill, Unit


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "source_language", "target_language", "is_active", "created_at")
    search_fields = ("title", "source_language", "target_language")
    list_filter = ("is_active", "source_language", "target_language")


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "order", "color_hex", "created_at")
    search_fields = ("title", "course__title")
    list_filter = ("course",)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("title", "unit", "order", "total_lessons", "created_at")
    search_fields = ("title", "unit__title")
    list_filter = ("unit__course", "unit")
