from django.urls import path
from .views import NextLessonView

app_name = "skills"

urlpatterns = [
    path("<uuid:skill_id>/next-lesson/", NextLessonView.as_view(), name="next_lesson"),
]
