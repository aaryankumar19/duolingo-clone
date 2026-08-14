from django.contrib import admin
from .models import Exercise, Lesson


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("title", "unit", "order", "xp_reward", "created_at")
    search_fields = ("title", "unit__title")
    list_filter = ("unit__section__course", "unit")


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ("lesson", "exercise_type", "order", "created_at")
    search_fields = ("prompt", "lesson__title")
    list_filter = ("exercise_type", "lesson__unit")

