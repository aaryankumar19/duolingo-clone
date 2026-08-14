from django.urls import path
from .views import HeartRefillView

app_name = "hearts"

urlpatterns = [
    path("refill-gems/", HeartRefillView.as_view(), name="refill_gems"),
]
