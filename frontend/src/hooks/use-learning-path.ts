import { useQuery } from '@tanstack/react-query';
import { learningApi } from '@/lib/api/learning/api';

export function useLearningPath() {
  return useQuery({
    queryKey: ['learningPath'],
    queryFn: () => learningApi.getLearningPath(),
    staleTime: 1000 * 60 * 2, // 2 min cache
    retry: 1,
  });
}
