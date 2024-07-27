import { useMutation, useQueryClient } from '@tanstack/react-query';
import { associateLesson, disassociateLesson } from '../api/endpoints/lesson';

export const useAssociateLesson = (studentId: string, teacherId: string) => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, string>({
    mutationFn: (lessonId: string) => associateLesson(studentId, teacherId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentLessons', studentId] });
    },
  });
};

export const useDisassociateLesson = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, string>({
    mutationFn: (lessonId: string) => disassociateLesson(lessonId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentLessons', studentId] });
    },
  });
};