from django.urls import path
from .views import ActivityHistoryView, ActivityTodayView

app_name = "activity"

urlpatterns = [
    path("", ActivityHistoryView.as_view(), name="history"),
    path("today/", ActivityTodayView.as_view(), name="today"),
]
