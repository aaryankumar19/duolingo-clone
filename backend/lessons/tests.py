import json

from django.test import Client, TestCase
from django.urls import reverse

from courses.models import Course, Section, Unit
from lessons.models import Exercise, Lesson
from progress.models import UserLessonHistory, UserUnitProgress
from users.models import User, UserCourse
from users.services import SessionService


class LessonsTestCase(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(
            email="learner@example.com",
            username="learner_1",
            gems=500,
            hearts=5,
            xp=0,
        )
        self.token = SessionService.create_session(self.user)
        self.auth_headers = {"HTTP_AUTHORIZATION": f"Bearer {self.token}"}

        self.course = Course.objects.create(
            title="Spanish from English",
            source_language="English",
            target_language="Spanish",
            is_active=True,
        )
        self.user_course = UserCourse.objects.create(
            user=self.user,
            course=self.course,
        )

        self.section = Section.objects.create(
            course=self.course,
            title="Basics",
            target_language="Hola",
            order=1,
        )

        self.unit1 = Unit.objects.create(
            section=self.section,
            title="Greetings",
            order=1,
        )
        self.unit2 = Unit.objects.create(
            section=self.section,
            title="Food",
            order=2,
        )

        # Progress for unit 1 (unlocked)
        self.prog1 = UserUnitProgress.objects.create(
            user=self.user,
            unit=self.unit1,
            is_unlocked=True,
            completed_lessons=0,
        )

        self.lesson1 = Lesson.objects.create(
            unit=self.unit1,
            title="Greetings Lesson 1",
            order=1,
            xp_reward=10,
        )

        self.ex_mc = Exercise.objects.create(
            lesson=self.lesson1,
            exercise_type=Exercise.ExerciseType.MULTIPLE_CHOICE,
            prompt="Select 'Hello':",
            content_json={"options": ["Hola", "Adiós"]},
            correct_answer={"answer": "Hola"},
            order=1,
        )

        self.ex_tr = Exercise.objects.create(
            lesson=self.lesson1,
            exercise_type=Exercise.ExerciseType.TRANSLATE,
            prompt="Translate 'Thank you':",
            content_json={"word_bank": ["Gracias", "Por", "favor"]},
            correct_answer={"answer": "Gracias"},
            order=2,
        )

        self.ex_mp = Exercise.objects.create(
            lesson=self.lesson1,
            exercise_type=Exercise.ExerciseType.MATCH_PAIRS,
            prompt="Match pairs:",
            content_json={"pairs": [{"spanish": "Agua", "english": "Water"}]},
            correct_answer={"pairs": {"Agua": "Water"}},
            order=3,
        )

    def test_next_lesson_success(self):
        url = reverse("skills:next_lesson", kwargs={"skill_id": str(self.unit1.id)})
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertEqual(res_data["code"], "NEXT_LESSON_RETRIEVED")
        self.assertEqual(res_data["data"]["lesson"]["id"], str(self.lesson1.id))

    def test_next_lesson_locked_unit(self):
        url = reverse("skills:next_lesson", kwargs={"skill_id": str(self.unit2.id)})
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, 403)
        res_data = response.json()
        self.assertEqual(res_data["error"]["code"], "UNIT_LOCKED")

    def test_submit_exercise_correct(self):
        url = reverse("lessons:submit_exercise", kwargs={"exercise_id": str(self.ex_mc.id)})
        payload = {"user_answer": "Hola"}
        response = self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json",
            **self.auth_headers,
        )
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertTrue(res_data["data"]["is_correct"])
        self.assertEqual(res_data["data"]["hearts_remaining"], 5)

    def test_submit_exercise_incorrect_deducts_heart(self):
        url = reverse("lessons:submit_exercise", kwargs={"exercise_id": str(self.ex_mc.id)})
        payload = {"user_answer": "Adiós"}
        response = self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json",
            **self.auth_headers,
        )
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertFalse(res_data["data"]["is_correct"])
        self.assertEqual(res_data["data"]["hearts_remaining"], 4)

    def test_submit_exercise_match_pairs(self):
        url = reverse("lessons:submit_exercise", kwargs={"exercise_id": str(self.ex_mp.id)})
        payload = {"user_answer": {"pairs": {"Agua": "Water"}}}
        response = self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json",
            **self.auth_headers,
        )
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertTrue(res_data["data"]["is_correct"])

    def test_complete_lesson_atomic_award_and_unlock(self):
        url = reverse("lessons:complete_lesson", kwargs={"lesson_id": str(self.lesson1.id)})
        response = self.client.post(
            url,
            data=json.dumps({}),
            content_type="application/json",
            **self.auth_headers,
        )
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertEqual(res_data["code"], "LESSON_COMPLETED")
        self.assertEqual(res_data["data"]["xp_earned"], 10)
        self.assertFalse(res_data["data"]["is_replay"])
        self.assertTrue(res_data["data"]["next_unit_unlocked"])

        # Check DB state
        self.user.refresh_from_db()
        self.assertEqual(self.user.xp, 10)
        self.assertEqual(self.user.streak_count, 1)

        prog1 = UserUnitProgress.objects.get(user=self.user, unit=self.unit1)
        self.assertTrue(prog1.is_completed)

        prog2 = UserUnitProgress.objects.get(user=self.user, unit=self.unit2)
        self.assertTrue(prog2.is_unlocked)

    def test_complete_lesson_replay_idempotency(self):
        # Initial completion
        url = reverse("lessons:complete_lesson", kwargs={"lesson_id": str(self.lesson1.id)})
        self.client.post(url, data=json.dumps({}), content_type="application/json", **self.auth_headers)

        # Replay completion
        response = self.client.post(
            url,
            data=json.dumps({}),
            content_type="application/json",
            **self.auth_headers,
        )
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertTrue(res_data["data"]["is_replay"])
        self.assertEqual(res_data["data"]["xp_earned"], 0)

        # User XP should remain 10 (no double XP)
        self.user.refresh_from_db()
        self.assertEqual(self.user.xp, 10)
        self.assertEqual(UserLessonHistory.objects.filter(user=self.user, lesson=self.lesson1).count(), 2)
