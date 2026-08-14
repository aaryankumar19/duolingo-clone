# Duolingo Clone

A full-stack Duolingo-inspired web app built for an SDE assignment. It replicates the core learning experience, including a visual skill path, interactive exercise lessons, hearts, XP, daily streaks, leaderboards, and user achievements.

![Learning Path](https://duolingo-clone.aaryank.me/Screenshot_20260814_112128.png)

### Screenshots

| Practicing Lesson | Profile Page | Login Page |
| :---: | :---: | :---: |
| ![Practicing](https://duolingo-clone.aaryank.me/Screenshot_20260814_112158.png) | ![Profile Page](https://duolingo-clone.aaryank.me/Screenshot_20260814_112133.png) | ![Login Page](https://duolingo-clone.aaryank.me/Screenshot_20260814_112025.png) |

---

## Features

- **Learning Path**: Visual tree of units and skills with lock/unlock state progression.
- **Interactive Lessons**: Supports 5 exercise types: Multiple Choice, Word Bank (Tap-the-words), Match Pairs, Fill in the Blank, and Type Answer. Immediate feedback with UI sound effects.
- **Hearts & Health**: Lose hearts on incorrect answers, refill via shop or practice.
- **XP & Daily Streaks**: XP awarded per lesson, daily activity tracking, and streak counters.
- **Leaderboard**: Weekly and all-time rankings seeded with learner accounts.
- **Achievements**: Unlockable badges based on streaks and milestone progress.
- **Shop**: Gem economy to refill hearts.

---

## Tech Stack

- **Frontend**: Next.js 16.3.0, React 19, TypeScript, Tailwind CSS, Framer Motion, Zustand, TanStack React Query, Web Audio API.
- **Backend**: Python 3.13.8, Django 6.1, WhiteNoise, Gunicorn.
- **Database**: SQLite 3 (15 custom model tables).

---

## Project Structure

```
duolingo-clone/
├── backend/
│   ├── common/              # Middleware, JSON helpers, exceptions
│   ├── courses/             # Course, Section, Unit models & seed script
│   ├── gamification/        # Leaderboard & Achievement services
│   ├── lessons/             # Lesson player, exercise validators
│   ├── progress/            # User progress tracking & lesson history
│   ├── users/               # Authentication, sessions & daily activity
│   ├── website/             # Django settings & root URL routing
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/             # App Router pages (learn, lesson, leaderboard, profile, shop)
│   │   ├── components/      # UI components & 5 exercise renderers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # API client, sound synthesizer, helpers
│   │   ├── store/           # Zustand state management
│   │   └── types/           # TypeScript type definitions
│   ├── package.json
│   └── next.config.ts
└── README.md
```

---

## Database Schema

```mermaid
erDiagram
    User ||--o{ UserCourse : selects
    User ||--o{ Session : holds
    User ||--o{ DailyActivity : logs
    User ||--o{ UserUnitProgress : tracks
    User ||--o{ UserLessonHistory : completes
    User ||--o{ UserAchievement : unlocks

    Course ||--o{ Section : contains
    Section ||--o{ Unit : contains
    Unit ||--o{ Lesson : contains
    Lesson ||--o{ Exercise : contains
    Achievement ||--o{ UserAchievement : awarded
```

The database consists of **15 custom model tables** across 5 Django apps (`users`, `courses`, `lessons`, `progress`, `gamification`). Course structure flows hierarchically (`Course` → `Section` → `Unit` → `Lesson` → `Exercise`), while user state (`UserUnitProgress`, `UserLessonHistory`, `DailyActivity`) tracks individual learning progress.

---

## API Endpoints

Base URL: `/api`

### Auth & User Profile
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register/` | Register new user session | No |
| `POST` | `/api/auth/login/` | Log in user and return token | No |
| `POST` | `/api/auth/logout/` | Revoke user session | Yes |
| `GET` | `/api/profile/` | Fetch user profile, total XP, streak & achievements | Yes |
| `GET` | `/api/activity/today/` | Fetch today's XP gain and goal progress | Yes |

### Courses & Learning Path
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/courses/` | List available language courses | Yes |
| `POST` | `/api/courses/select/` | Select/activate language course | Yes |
| `GET` | `/api/courses/current/path/` | Fetch active course path (sections, units, lock/unlock status) | Yes |

### Lessons & Exercises
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/skills/<skill_id>/next-lesson/` | Fetch next lesson & exercise list for a unit | Yes |
| `POST` | `/api/lessons/exercises/<exercise_id>/submit/` | Validate exercise submission | Yes |
| `POST` | `/api/lessons/<lesson_id>/complete/` | Complete lesson, record XP, update streak & unit progress | Yes |

### Gamification & Shop
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/leaderboard/` | Fetch weekly / all-time rankings | Yes |
| `GET` | `/api/achievements/` | List achievements and unlock states | Yes |
| `POST` | `/api/hearts/refill-gems/` | Refill hearts balance to 5 using gems | Yes |

---

## Getting Started

### Prerequisites
- **Node.js**: v18+
- **Python**: 3.13

---

### 1. Backend Setup

```bash
cd backend
```

#### Linux & macOS
```bash
# Create virtual environment
python3 -m venv env
source env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations and seed course content
python manage.py migrate
python manage.py seed_spanish

# Start Django backend (http://localhost:8000)
python manage.py runserver
```

#### Windows (Command Prompt / PowerShell)
```cmd
:: Create virtual environment
python -m venv env
env\Scripts\activate

:: Install dependencies
pip install -r requirements.txt

:: Run migrations and seed course content
python manage.py migrate
python manage.py seed_spanish

:: Start Django backend (http://localhost:8000)
python manage.py runserver
```

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Next.js dev server (http://localhost:3000)
npm run dev
```

---

## Implementation Notes & Simplifications

- **Authentication**: Pre-configured default user is available for instant testing; full login/registration supported.
- **Audio Feedback**: Synthesized directly in the browser via Web Audio API; audio URLs supported in exercise schema.
- **In-App Currency**: Gems are a mocked currency used for heart refills in the shop.
- **Seeded Content**: Includes a pre-populated Spanish course with 5 sections, 27 units, and 243 exercises.
