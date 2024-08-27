import { useQuery, useQueryClient, useMutation  } from '@tanstack/react-query';
import {
  fetchStudents,
  searchStudents,
  associateStudentToTeacher,
} from '../api/endpoints/teacher';

export const useGetStudents = (teacherId: string) => {

  return useQuery({
    queryKey: ["students", teacherId],
    queryFn: () => fetchStudents(teacherId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

export const useSearchStudents = (query: string) => {
  return useQuery<SearchStudent[]>({
    queryKey: ['studentSearch', query],
    queryFn: () => searchStudents(query),
    enabled: query.length > 0,
  });
};

export function useAssociateStudentToTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: associateStudentToTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}