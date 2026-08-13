from django.urls import path
from .views import CourseCurrentPathView, CourseListView, CourseSelectView

app_name = "courses"

urlpatterns = [
    path("", CourseListView.as_view(), name="list"),
    path("select/", CourseSelectView.as_view(), name="select"),
    path("current/path/", CourseCurrentPathView.as_view(), name="current_path"),
]
