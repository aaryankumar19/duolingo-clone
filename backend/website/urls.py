from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("users/", include("users.urls")),
    path("api/auth/", include(("users.urls", "auth"), namespace="auth")),
    path("api/courses/", include("courses.urls")),
    path("api/skills/", include("lessons.urls_skills")),
    path("api/lessons/", include("lessons.urls_lessons")),
    path("api/hearts/", include("users.urls_hearts")),
    path("api/activity/", include("users.urls_activity")),
    path("api/profile/", include("users.urls_profile")),
    path("api/leaderboard/", include("gamification.urls_leaderboard")),
    path("api/achievements/", include("gamification.urls_achievements")),
]
