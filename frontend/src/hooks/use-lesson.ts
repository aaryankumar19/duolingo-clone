import { useQuery } from '@tanstack/react-query';
import { lessonApi } from '@/lib/api/lesson/api';
import { useLessonStore } from '@/store/lesson-store';
import { useEffect } from 'react';

export function useLesson(lessonId: string) {
  const query = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => lessonApi.getLesson(lessonId),
    enabled: !!lessonId,
  });

  const startLesson = useLessonStore((s) => s.startLesson);

  useEffect(() => {
    if (query.data) {
      startLesson(query.data);
    }
  }, [query.data, startLesson]);

  return query;
}
