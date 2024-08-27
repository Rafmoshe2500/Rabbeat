import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLesson } from '../../api/endpoints/lesson';

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: string) => deleteLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessonsDetails']});
    },
  });
};
