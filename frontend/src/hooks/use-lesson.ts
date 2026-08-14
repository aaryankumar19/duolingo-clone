import { useQuery } from '@tanstack/react-query';
import { lessonApi } from '@/lib/api/lesson/api';
import { useLessonStore } from '@/store/lesson-store';
import { useAuthStore } from '@/store/use-auth-store';
import { useEffect } from 'react';

/**
 * Fetches the next lesson for a given skill/unit ID from the backend and
 * initializes the lesson store.
 * skillId — the unit UUID from the learning path (passed as the URL param)
 */
export function useLesson(skillId: string) {
  const query = useQuery({
    queryKey: ['lesson', skillId],
    queryFn: () => lessonApi.getNextLesson(skillId),
    enabled: !!skillId,
    retry: 1,
  });

  const startLesson = useLessonStore((s) => s.startLesson);
  const hearts = useAuthStore((s) => s.user?.hearts ?? 5);

  useEffect(() => {
    if (query.data) {
      const currentHearts = useAuthStore.getState().user?.hearts ?? 5;
      startLesson(query.data, currentHearts);
    }
  }, [query.data, startLesson]);

  return query;
}

