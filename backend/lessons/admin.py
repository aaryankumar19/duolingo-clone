from django.contrib import admin

from common.admin import ReadOnlyDemoAdminMixin, ReadOnlyDemoInlineMixin
from .models import Exercise, Lesson


class ExerciseInline(ReadOnlyDemoInlineMixin, admin.StackedInline):
    model = Exercise
    extra = 0
    fields = ("order", "exercise_type", "prompt", "audio_url", "content_json", "correct_answer")
    ordering = ("order",)


@admin.register(Lesson)
class LessonAdmin(ReadOnlyDemoAdminMixin, admin.ModelAdmin):
    list_display = (
        "order",
        "title",
        "unit",
        "xp_reward",
        "created_at",
    )
    search_fields = ("title", "unit__title", "unit__section__title")
    list_filter = ("unit__section__course", "unit__section", "unit")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("unit", "order")
    inlines = [ExerciseInline]


@admin.register(Exercise)
class ExerciseAdmin(ReadOnlyDemoAdminMixin, admin.ModelAdmin):
    list_display = (
        "order",
        "lesson",
        "exercise_type",
        "prompt",
        "created_at",
    )
    search_fields = ("prompt", "lesson__title")
    list_filter = ("exercise_type", "lesson__unit__section__course", "lesson__unit")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("lesson", "order")
