from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from common.jsonUtils import JsonUtilsMixin
from website.utils import require_auth
from .services import GamificationService


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(require_auth, name="dispatch")
class LeaderboardView(JsonUtilsMixin, View):

    def get(self, request):
        timeframe = request.GET.get("timeframe", "weekly")
        if timeframe not in ("weekly", "all_time"):
            timeframe = "weekly"

        leaderboard_data = GamificationService.get_leaderboard(timeframe)

        return self._json_success(
            data={"leaderboard": leaderboard_data, "timeframe": timeframe},
            code="LEADERBOARD_RETRIEVED",
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(require_auth, name="dispatch")
class AchievementListView(JsonUtilsMixin, View):

    def get(self, request):
        achievements_data = GamificationService.get_achievements(request.user)

        return self._json_success(
            data={"achievements": achievements_data},
            code="ACHIEVEMENTS_RETRIEVED",
            status=200,
        )
