from django.urls import path
from .views import AchievementListView

app_name = "achievements"

urlpatterns = [
    path("", AchievementListView.as_view(), name="list"),
]
