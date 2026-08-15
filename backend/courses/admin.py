from django.contrib import admin

from common.admin import ReadOnlyDemoAdminMixin, ReadOnlyDemoInlineMixin
from .models import Character, Course, Section, Unit, UnitIcon


class SectionInline(ReadOnlyDemoInlineMixin, admin.TabularInline):
    model = Section
    extra = 0
    fields = ("order", "title", "target_language", "character", "color_hex")
    ordering = ("order",)


class UnitInline(ReadOnlyDemoInlineMixin, admin.TabularInline):
    model = Unit
    extra = 0
    fields = ("order", "title", "unit_type", "icon", "character")
    ordering = ("order",)


@admin.register(Character)
class CharacterAdmin(ReadOnlyDemoAdminMixin, admin.ModelAdmin):
    list_display = ("name", "image_url")
    search_fields = ("name",)


@admin.register(UnitIcon)
class UnitIconAdmin(ReadOnlyDemoAdminMixin, admin.ModelAdmin):
    list_display = ("name", "icon_url")
    search_fields = ("name",)


@admin.register(Course)
class CourseAdmin(ReadOnlyDemoAdminMixin, admin.ModelAdmin):
    list_display = (
        "title",
        "source_language",
        "target_language",
        "is_active",
        "created_at",
    )
    search_fields = ("title", "source_language", "target_language")
    list_filter = ("is_active", "source_language", "target_language")
    readonly_fields = ("id", "created_at", "updated_at")
    inlines = [SectionInline]


@admin.register(Section)
class SectionAdmin(ReadOnlyDemoAdminMixin, admin.ModelAdmin):
    list_display = (
        "order",
        "title",
        "course",
        "character",
        "color_hex",
        "created_at",
    )
    search_fields = ("title", "course__title")
    list_filter = ("course",)
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("course", "order")
    inlines = [UnitInline]


@admin.register(Unit)
class UnitAdmin(ReadOnlyDemoAdminMixin, admin.ModelAdmin):
    list_display = (
        "order",
        "title",
        "unit_type",
        "section",
        "character",
        "icon",
        "created_at",
    )
    search_fields = ("title", "section__title", "section__course__title")
    list_filter = ("section__course", "section", "unit_type")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("section", "order")
