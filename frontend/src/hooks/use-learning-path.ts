import { useQuery } from '@tanstack/react-query';
import { learningApi } from '@/lib/api/learning/api';

export function useLearningPath(courseId: string = 'spanish') {
  return useQuery({
    queryKey: ['learningPath', courseId],
    queryFn: () => learningApi.getCourseData(courseId),
  });
}
