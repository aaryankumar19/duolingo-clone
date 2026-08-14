// ─── Frontend Display Types (used by components) ────────────────────────────

export type SkillStatus = 'locked' | 'active' | 'completed';

export interface SkillNodeData {
  id: string;
  title: string;
  icon: string;
  status: SkillStatus;
  progress: number;
  totalLessons: number;
  crowns: number;
  totalCrowns: number;
  description: string;
}

export interface UnitData {
  id: string;
  number: number;
  title: string;
  description: string;
  backgroundColor: string;
  skills: SkillNodeData[];
}

export interface CourseData {
  id: string;
  title: string;
  flag: string;
  units: UnitData[];
}

// ─── Backend API Shapes ───────────────────────────────────────────────────────

/** A single unit returned inside GET /api/courses/current/path/ */
export interface BackendUnit {
  id: string;
  title: string;
  total_lessons: number;
  completed_lessons: number;
  is_unlocked: boolean;
  is_completed: boolean;
  crown_level: number;
}

/** A section (groups units) returned by the path endpoint */
export interface BackendSection {
  id?: string;
  order?: number;
  title: string;
  target_language?: string;
  transliteration?: string;
  color_hex: string;
  character?: {
    name: string;
    image_url: string;
  } | null;
  units: BackendUnit[];
}

/** Full response shape for GET /api/courses/current/path/ */
export interface BackendPathResponse {
  data: {
    course: {
      title: string;
      flag_icon_url: string | null;
    };
    sections: BackendSection[];
  };
}

/** A course returned by GET /api/courses/ */
export interface BackendCourse {
  id: string;
  title: string;
  source_language?: string;
  target_language?: string;
  flag_icon_url: string | null;
  is_enrolled: boolean;
  is_active: boolean;
}

export interface BackendCoursesResponse {
  data: {
    courses: BackendCourse[];
  };
}

/** Daily activity returned by GET /api/activity/today/ */
export interface DailyActivity {
  xp_today: number;
  daily_goal: number;
  lessons_today: number;
}

/** Historical daily activity entry from GET /api/activity/?days=N */
export interface ActivityDay {
  date: string;
  xp: number;
}
