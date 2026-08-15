from django.core.exceptions import PermissionDenied
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group, User as DjangoUser

from common.admin import ReadOnlyDemoAdminMixin, ReadOnlyDemoInlineMixin
from .models import DailyActivity, Session, User, UserCourse

# Disable password change for non-superusers
_original_password_change = admin.site.password_change


def restricted_password_change(request, extra_context=None):
    if not request.user.is_superuser:
        raise PermissionDenied("Password change is disabled for non-superusers.")
    return _original_password_change(request, extra_context)


admin.site.password_change = restricted_password_change

if admin.site.is_registered(DjangoUser):
    admin.site.unregister(DjangoUser)
if admin.site.is_registered(Group):
    admin.site.unregister(Group)


@admin.register(DjangoUser)
class CustomDjangoUserAdmin(ReadOnlyDemoAdminMixin, BaseUserAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.filter(pk=request.user.pk)
        return qs


@admin.register(Group)
class CustomGroupAdmin(ReadOnlyDemoAdminMixin, admin.ModelAdmin):
    pass


class UserCourseInline(ReadOnlyDemoInlineMixin, admin.TabularInline):
    model = UserCourse
    extra = 0
    readonly_fields = ("created_at", "updated_at")


class SessionInline(ReadOnlyDemoInlineMixin, admin.TabularInline):
    model = Session
    extra = 0
    fields = ("session_token_hash", "expires_at", "revoked_at", "created_at")
    readonly_fields = ("session_token_hash", "created_at")


@admin.register(User)
class UserAdmin(ReadOnlyDemoAdminMixin, admin.ModelAdmin):
    list_display = (
        "username",
        "email",
        "age",
        "xp",
        "gems",
        "hearts",
        "streak_count",
        "last_active_date",
        "created_at",
    )
    search_fields = ("username", "email", "id")
    list_filter = ("created_at", "last_active_date", "hearts")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("-xp",)
    inlines = [UserCourseInline, SessionInline]


@admin.register(Session)
class SessionAdmin(ReadOnlyDemoAdminMixin, admin.ModelAdmin):
    list_display = (
        "user",
        "expires_at",
        "revoked_at",
        "created_at",
    )
    search_fields = ("user__username", "user__email", "session_token_hash")
    list_filter = ("created_at", "expires_at", "revoked_at")
    readonly_fields = ("id", "session_token_hash", "created_at")
    ordering = ("-created_at",)


@admin.register(DailyActivity)
class DailyActivityAdmin(ReadOnlyDemoAdminMixin, admin.ModelAdmin):
    list_display = ("user", "date", "xp_gained", "created_at")
    search_fields = ("user__username", "user__email")
    list_filter = ("date",)
    ordering = ("-date",)


@admin.register(UserCourse)
class UserCourseAdmin(ReadOnlyDemoAdminMixin, admin.ModelAdmin):
    list_display = ("user", "course", "updated_at", "created_at")
    search_fields = ("user__username", "user__email", "course__title")
    list_filter = ("updated_at", "created_at")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("-updated_at",)
