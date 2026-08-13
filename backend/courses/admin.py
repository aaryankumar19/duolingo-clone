from django.contrib import admin
from .models import Character, Course, Section, Unit, UnitIcon


@admin.register(Character)
class CharacterAdmin(admin.ModelAdmin):
    list_display = ("name", "image_url")
    search_fields = ("name",)


@admin.register(UnitIcon)
class UnitIconAdmin(admin.ModelAdmin):
    list_display = ("name", "icon_url")
    search_fields = ("name",)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "source_language", "target_language", "is_active", "created_at")
    search_fields = ("title", "source_language", "target_language")
    list_filter = ("is_active", "source_language", "target_language")


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "order", "color_hex", "created_at")
    search_fields = ("title", "course__title")
    list_filter = ("course",)


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ("title", "section", "unit_type", "order", "created_at")
    search_fields = ("title", "section__title")
    list_filter = ("section__course", "section", "unit_type")

