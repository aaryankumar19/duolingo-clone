import json

from django.test import Client, TestCase
from django.urls import reverse

from courses.models import Course, Section, Unit
from users.models import User, UserCourse
from users.services import SessionService


class CoursesTestCase(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create(
            email="learner@example.com",
            username="learner_1",
            gems=500,
            hearts=5,
        )
        self.token = SessionService.create_session(self.user)
        self.auth_headers = {"HTTP_AUTHORIZATION": f"Bearer {self.token}"}

        self.course = Course.objects.create(
            title="Spanish from English",
            source_language="English",
            target_language="Spanish",
            is_active=True,
        )
        self.section = Section.objects.create(
            course=self.course,
            title="Intro",
            target_language="Hola",
            order=1,
        )
        self.unit = Unit.objects.create(
            section=self.section,
            title="Greetings",
            order=1,
        )

    def test_get_courses_unauthenticated(self):
        url = reverse("courses:list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)

    def test_get_courses_authenticated(self):
        url = reverse("courses:list")
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertEqual(res_data["code"], "COURSES_RETRIEVED")
        courses = res_data["data"]["courses"]
        self.assertEqual(len(courses), 1)
        self.assertFalse(courses[0]["is_enrolled"])
        self.assertFalse(courses[0]["is_active"])

    def test_select_course_success(self):
        url = reverse("courses:select")
        payload = {"course_id": str(self.course.id)}
        response = self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json",
            **self.auth_headers,
        )
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertEqual(res_data["code"], "COURSE_SELECTED")
        self.assertTrue(
            UserCourse.objects.filter(user=self.user, course=self.course).exists()
        )

    def test_select_course_invalid_id(self):
        url = reverse("courses:select")
        payload = {"course_id": "00000000-0000-0000-0000-000000000000"}
        response = self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json",
            **self.auth_headers,
        )
        self.assertEqual(response.status_code, 404)

    def test_get_current_path_no_course(self):
        url = reverse("courses:current_path")
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, 404)

    def test_get_current_path_success(self):
        UserCourse.objects.create(user=self.user, course=self.course)

        url = reverse("courses:current_path")
        response = self.client.get(url, **self.auth_headers)
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertEqual(res_data["code"], "PATH_RETRIEVED")
        self.assertEqual(res_data["data"]["course"]["title"], "Spanish from English")
        sections = res_data["data"]["sections"]
        self.assertEqual(len(sections), 1)
        self.assertTrue(sections[0]["units"][0]["is_unlocked"])
