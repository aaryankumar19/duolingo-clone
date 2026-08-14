import { apiClient } from '../client';
import {
  BackendPathResponse,
  BackendCoursesResponse,
  BackendCourse,
  BackendSection,
  DailyActivity,
  ActivityDay,
} from '@/types/learning';

// ─── Courses ──────────────────────────────────────────────────────────────────

export const learningApi = {
  /** GET /api/courses/ — all available courses with enrollment status */
  getCourses: async (): Promise<BackendCourse[]> => {
    const res = await apiClient<BackendCoursesResponse>('/courses/');
    return res.data.courses;
  },

  /** POST /api/courses/select/ — switch active course */
  selectCourse: async (courseId: string): Promise<void> => {
    await apiClient('/courses/select/', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId }),
    });
  },

  /** GET /api/courses/current/path/ — full learning path for active course */
  getLearningPath: async (): Promise<{
    courseTitle: string;
    flagUrl: string | null;
    sections: BackendSection[];
  }> => {
    const res = await apiClient<BackendPathResponse>('/courses/current/path/');
    return {
      courseTitle: res.data.course.title,
      flagUrl: res.data.course.flag_icon_url,
      sections: res.data.sections,
    };
  },

  /** GET /api/activity/today/ — today's XP progress toward daily goal */
  getDailyActivity: async (): Promise<DailyActivity> => {
    const res = await apiClient<{ data: DailyActivity }>('/activity/today/');
    return res.data;
  },

  /** GET /api/activity/?days=N — historical XP per day */
  getActivityHistory: async (days: number = 7): Promise<ActivityDay[]> => {
    const res = await apiClient<{ data: { activity: ActivityDay[] } }>(
      `/activity/?days=${days}`
    );
    return res.data.activity ?? [];
  },
};
