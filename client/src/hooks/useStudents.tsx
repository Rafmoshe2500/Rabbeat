import { useQuery, useQueryClient, useMutation  } from '@tanstack/react-query';
import { fetchStudents, searchStudentByEmail, associateStudentToTeacher } from '../api/endpoints/teacher';

export const useGetStudents = (teacherId: string) => {

  return useQuery({
    queryKey: ["students", teacherId],
    queryFn: () => fetchStudents(teacherId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

export const useSearchStudentByEmail = (email: string) => {
  return useQuery({
    queryKey: ['studentSearch', email],
    queryFn: () => searchStudentByEmail(email),
    enabled: email.length > 0,
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