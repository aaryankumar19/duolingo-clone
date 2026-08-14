from django.core.management.base import BaseCommand
from django.db import transaction

from courses.models import Character, Course, Section, Unit, UnitIcon
from gamification.models import Achievement
from lessons.models import Exercise, Lesson


class Command(BaseCommand):
    help = "Seeds the database with a single Spanish course containing 5 sections, 5-6 units per section, lessons, exercises, and achievements idempotently."

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write("Starting Spanish course & achievements seeding...")

        # 1. Create/Get Characters
        characters_data = [
            {"name": "Duo", "image_url": "https://d35aaqx5ub95lt.cloudfront.net/images/characters/duo.svg"},
            {"name": "Junior", "image_url": "https://d35aaqx5ub95lt.cloudfront.net/images/characters/junior.svg"},
            {"name": "Bea", "image_url": "https://d35aaqx5ub95lt.cloudfront.net/images/characters/bea.svg"},
            {"name": "Lin", "image_url": "https://d35aaqx5ub95lt.cloudfront.net/images/characters/lin.svg"},
            {"name": "Oscar", "image_url": "https://d35aaqx5ub95lt.cloudfront.net/images/characters/oscar.svg"},
        ]
        characters = {}
        for c_data in characters_data:
            char, _ = Character.objects.get_or_create(
                name=c_data["name"],
                defaults={"image_url": c_data["image_url"]},
            )
            characters[c_data["name"]] = char

        # 2. Create/Get Unit Icons
        icons_data = [
            {"name": "book", "icon_url": "https://d35aaqx5ub95lt.cloudfront.net/images/units/book.svg"},
            {"name": "food", "icon_url": "https://d35aaqx5ub95lt.cloudfront.net/images/units/food.svg"},
            {"name": "airplane", "icon_url": "https://d35aaqx5ub95lt.cloudfront.net/images/units/airplane.svg"},
            {"name": "people", "icon_url": "https://d35aaqx5ub95lt.cloudfront.net/images/units/people.svg"},
            {"name": "star", "icon_url": "https://d35aaqx5ub95lt.cloudfront.net/images/units/star.svg"},
            {"name": "trophy", "icon_url": "https://d35aaqx5ub95lt.cloudfront.net/images/units/trophy.svg"},
        ]
        icons = {}
        for i_data in icons_data:
            icon, _ = UnitIcon.objects.get_or_create(
                name=i_data["name"],
                defaults={"icon_url": i_data["icon_url"]},
            )
            icons[i_data["name"]] = icon

        # 3. Create/Get Spanish Course
        course, _ = Course.objects.get_or_create(
            title="Spanish from English",
            source_language="English",
            target_language="Spanish",
            defaults={
                "flag_icon_url": "https://flagcdn.com/w80/es.png",
                "is_active": True,
            },
        )
        self.stdout.write(f"Course ready: {course.title}")

        # 4. Define 5 Sections with 5-6 units each
        sections_config = [
            {
                "order": 1,
                "title": "Intro & Basics",
                "color_hex": "#58CC02",
                "character": characters["Duo"],
                "target_language": "¡Hola! Aprende lo básico de español.",
                "transliteration": "Hello! Learn Spanish basics.",
                "units": [
                    ("Basic Greetings", "Say hello, goodbye, and introduce yourself.", "book", characters["Duo"]),
                    ("Essential Phrases", "Learn yes, no, please, and thank you.", "book", characters["Junior"]),
                    ("People & Pronouns", "Talk about he, she, I, and you.", "people", characters["Bea"]),
                    ("Numbers 1-10", "Count from 1 to 10 in Spanish.", "star", characters["Lin"]),
                    ("Section 1 Review", "Review everything learned in Section 1.", "trophy", characters["Duo"]),
                ],
            },
            {
                "order": 2,
                "title": "Food & Dining",
                "color_hex": "#CE82FF",
                "character": characters["Junior"],
                "target_language": "Ordena comida y bebidas en español.",
                "transliteration": "Order food and drinks in Spanish.",
                "units": [
                    ("Ordering Drinks", "Ask for coffee, tea, and water.", "food", characters["Junior"]),
                    ("At the Restaurant", "Order dishes and ask for the bill.", "food", characters["Bea"]),
                    ("Common Foods", "Learn names of bread, cheese, and fruits.", "food", characters["Oscar"]),
                    ("Preferences", "Express what you like and dislike.", "star", characters["Lin"]),
                    ("Numbers 11-50", "Count up to 50 for prices and quantities.", "star", characters["Junior"]),
                    ("Dining Review", "Master ordering at a Spanish cafe.", "trophy", characters["Duo"]),
                ],
            },
            {
                "order": 3,
                "title": "Travel & Directions",
                "color_hex": "#00CD9C",
                "character": characters["Bea"],
                "target_language": "Viaja y pide direcciones fácilmente.",
                "transliteration": "Travel and ask for directions easily.",
                "units": [
                    ("Airport & Taxi", "Navigate arrivals, departures, and cabs.", "airplane", characters["Bea"]),
                    ("Hotel & Stay", "Check into hotels and request amenities.", "airplane", characters["Oscar"]),
                    ("Asking Directions", "Find the train station, bathroom, and museum.", "airplane", characters["Duo"]),
                    ("City Places", "Talk about parks, plazas, and stores.", "book", characters["Lin"]),
                    ("Time & Schedules", "Ask for the time and schedule appointments.", "star", characters["Junior"]),
                ],
            },
            {
                "order": 4,
                "title": "Family & Hobbies",
                "color_hex": "#FFC800",
                "character": characters["Lin"],
                "target_language": "Habla de tu familia y pasatiempos.",
                "transliteration": "Talk about your family and hobbies.",
                "units": [
                    ("Family Members", "Introduce your mother, father, and siblings.", "people", characters["Lin"]),
                    ("Describing People", "Talk about appearance and personality traits.", "people", characters["Bea"]),
                    ("Free Time Activities", "Discuss sports, music, and reading.", "star", characters["Oscar"]),
                    ("Weather & Seasons", "Describe sunny, rainy, and cold days.", "book", characters["Junior"]),
                    ("Family Review", "Consolidate family and hobbies vocabulary.", "trophy", characters["Duo"]),
                ],
            },
            {
                "order": 5,
                "title": "Daily Life & Work",
                "color_hex": "#FF4B4B",
                "character": characters["Oscar"],
                "target_language": "Describe tu rutina diaria y trabajo.",
                "transliteration": "Describe your daily routine and work.",
                "units": [
                    ("Morning Routine", "Talk about waking up, eating breakfast, and dressing.", "book", characters["Oscar"]),
                    ("Professions & Work", "Identify jobs, offices, and work tasks.", "people", characters["Lin"]),
                    ("Shopping & Clothes", "Buy clothes, ask about sizes and discounts.", "food", characters["Bea"]),
                    ("Health & Body", "Express how you feel and talk about health.", "star", characters["Junior"]),
                    ("Future Plans", "Talk about what you are going to do tomorrow.", "star", characters["Oscar"]),
                    ("Course Graduation", "Final comprehensive review unit.", "trophy", characters["Duo"]),
                ],
            },
        ]

        total_units = 0
        total_lessons = 0
        total_exercises = 0

        for s_cfg in sections_config:
            section, _ = Section.objects.get_or_create(
                course=course,
                order=s_cfg["order"],
                defaults={
                    "title": s_cfg["title"],
                    "character": s_cfg["character"],
                    "target_language": s_cfg["target_language"],
                    "transliteration": s_cfg["transliteration"],
                    "color_hex": s_cfg["color_hex"],
                },
            )

            for u_idx, (u_title, u_desc, icon_key, u_char) in enumerate(s_cfg["units"], start=1):
                unit_type = Unit.UnitType.MILESTONE if icon_key == "trophy" else Unit.UnitType.LESSON
                unit, _ = Unit.objects.get_or_create(
                    section=section,
                    order=u_idx,
                    defaults={
                        "title": u_title,
                        "description": u_desc,
                        "icon": icons[icon_key],
                        "character": u_char,
                        "unit_type": unit_type,
                    },
                )
                total_units += 1

                for l_idx in range(1, 4):
                    lesson, _ = Lesson.objects.get_or_create(
                        unit=unit,
                        order=l_idx,
                        defaults={
                            "title": f"{u_title} - Part {l_idx}",
                            "xp_reward": 10,
                        },
                    )
                    total_lessons += 1

                    ex1, _ = Exercise.objects.get_or_create(
                        lesson=lesson,
                        order=1,
                        defaults={
                            "exercise_type": Exercise.ExerciseType.MULTIPLE_CHOICE,
                            "prompt": "Select the correct translation for 'Hello':",
                            "content_json": {"options": ["Hola", "Adiós", "Gracias", "Por favor"]},
                            "correct_answer": {"answer": "Hola"},
                        },
                    )
                    ex2, _ = Exercise.objects.get_or_create(
                        lesson=lesson,
                        order=2,
                        defaults={
                            "exercise_type": Exercise.ExerciseType.TRANSLATE,
                            "prompt": "Translate to Spanish: 'Thank you very much'",
                            "content_json": {"word_bank": ["Muchas", "gracias", "de", "nada", "hola"]},
                            "correct_answer": {"answer": "Muchas gracias"},
                        },
                    )
                    ex3, _ = Exercise.objects.get_or_create(
                        lesson=lesson,
                        order=3,
                        defaults={
                            "exercise_type": Exercise.ExerciseType.MATCH_PAIRS,
                            "prompt": "Match the Spanish words with their English meanings:",
                            "content_json": {
                                "pairs": [
                                    {"spanish": "Agua", "english": "Water"},
                                    {"spanish": "Pan", "english": "Bread"},
                                    {"spanish": "Casa", "english": "House"},
                                ]
                            },
                            "correct_answer": {
                                "pairs": {
                                    "Agua": "Water",
                                    "Pan": "Bread",
                                    "Casa": "House",
                                }
                            },
                        },
                    )
                    total_exercises += 3

        # 5. Seed Achievements
        achievements_data = [
            {
                "code": "FIRST_LESSON",
                "title": "First Step",
                "description": "Complete your very first lesson.",
                "target_value": 1,
                "badge_icon_url": "https://d35aaqx5ub95lt.cloudfront.net/images/achievements/first_lesson.svg",
            },
            {
                "code": "STREAK_7",
                "title": "Wildfire",
                "description": "Reach a 7-day streak.",
                "target_value": 7,
                "badge_icon_url": "https://d35aaqx5ub95lt.cloudfront.net/images/achievements/wildfire.svg",
            },
            {
                "code": "XP_100",
                "title": "Overachiever",
                "description": "Earn 100 total XP.",
                "target_value": 100,
                "badge_icon_url": "https://d35aaqx5ub95lt.cloudfront.net/images/achievements/xp.svg",
            },
        ]
        for ach in achievements_data:
            Achievement.objects.get_or_create(
                code=ach["code"],
                defaults={
                    "title": ach["title"],
                    "description": ach["description"],
                    "target_value": ach["target_value"],
                    "badge_icon_url": ach["badge_icon_url"],
                },
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully seeded database idempotently!\n"
                f"- Course: 1 ({course.title})\n"
                f"- Sections: {len(sections_config)}\n"
                f"- Units: {total_units}\n"
                f"- Lessons: {total_lessons}\n"
                f"- Exercises: {total_exercises}\n"
                f"- Achievements: {len(achievements_data)}"
            )
        )
