from django.contrib import admin


class ReadOnlyDemoAdminMixin:
    """
    Mixin for Django ModelAdmin that grants read-only access for staff users who are not superusers (e.g. 'demo' user).
    - non-superusers can view all records across all tables.
    - non-superusers cannot add, edit, or delete any records.
    - all form fields are rendered as read-only for non-superusers.
    """

    def has_module_permission(self, request):
        if request.user.is_authenticated and request.user.is_staff:
            return True
        return super().has_module_permission(request)

    def has_view_permission(self, request, obj=None):
        if request.user.is_authenticated and request.user.is_staff:
            return True
        return super().has_view_permission(request, obj)

    def has_add_permission(self, request):
        if request.user.is_authenticated and not request.user.is_superuser:
            return False
        return super().has_add_permission(request)

    def has_change_permission(self, request, obj=None):
        if request.user.is_authenticated and not request.user.is_superuser:
            return False
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        if request.user.is_authenticated and not request.user.is_superuser:
            return False
        return super().has_delete_permission(request, obj)

    def get_readonly_fields(self, request, obj=None):
        readonly = list(super().get_readonly_fields(request, obj))
        if request.user.is_authenticated and not request.user.is_superuser:
            opts = self.model._meta
            for field in opts.fields:
                if field.name not in readonly:
                    readonly.append(field.name)
            for m2m in opts.many_to_many:
                if m2m.name not in readonly:
                    readonly.append(m2m.name)
        return readonly


class ReadOnlyDemoInlineMixin:
    """
    Mixin for Django InlineModelAdmin that prevents non-superusers from adding, changing, or deleting inline records.
    """

    def has_add_permission(self, request, obj=None):
        if request.user.is_authenticated and not request.user.is_superuser:
            return False
        return super().has_add_permission(request, obj)

    def has_change_permission(self, request, obj=None):
        if request.user.is_authenticated and not request.user.is_superuser:
            return False
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        if request.user.is_authenticated and not request.user.is_superuser:
            return False
        return super().has_delete_permission(request, obj)
