from django.core.management.base import BaseCommand
from django.contrib.auth.models import User as DjangoUser


class Command(BaseCommand):
    help = "Sets up the demo user with read-only admin access."

    def handle(self, *args, **options):
        demo_user, created_demo = DjangoUser.objects.get_or_create(
            username="demo",
            defaults={
                "email": "demo@example.com",
                "is_staff": True,
                "is_superuser": False,
            },
        )
        demo_user.set_password("demo123")
        demo_user.is_staff = True
        demo_user.is_superuser = False
        demo_user.save()
        if created_demo:
            self.stdout.write(self.style.SUCCESS("Created demo user ('demo' / 'demo123')."))
        else:
            self.stdout.write(self.style.SUCCESS("Updated demo user ('demo' / 'demo123')."))
