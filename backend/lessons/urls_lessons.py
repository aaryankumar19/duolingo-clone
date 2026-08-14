from django.urls import path
from .views import ExerciseSubmitView, LessonCompleteView

app_name = "lessons"

urlpatterns = [
    path("exercises/<uuid:exercise_id>/submit/", ExerciseSubmitView.as_view(), name="submit_exercise"),
    path("<uuid:lesson_id>/complete/", LessonCompleteView.as_view(), name="complete_lesson"),
]
