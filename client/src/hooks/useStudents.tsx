import { useQuery } from '@tanstack/react-query';
import { fetchStudents } from '../api/endpoints/teacher';

export const useGetStudents = (teacherId: string) => {
  return useQuery({
    queryKey: ['students', teacherId],
    queryFn: () => fetchStudents(teacherId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}