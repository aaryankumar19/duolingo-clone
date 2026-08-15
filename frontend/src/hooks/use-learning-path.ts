import { useQuery } from '@tanstack/react-query';
import { learningApi } from '@/lib/api/learning/api';

export function useLearningPath() {
  return useQuery({
    queryKey: ['learningPath'],
    queryFn: () => learningApi.getLearningPath(),
    retry: 1,
  });
}
