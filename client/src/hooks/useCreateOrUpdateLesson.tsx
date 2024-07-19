import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrUpdateLesson } from "../api/endpoints/lesson";

export const useCreateOrUpdateLesson = (teacherId: string) => {
  const queryClient = useQueryClient();

  return useMutation<FormattedLesson, Error, FormattedLesson>({
    mutationFn: (lesson: FormattedLesson) => createOrUpdateLesson(lesson, teacherId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allLessons"] });
    },
  });
};
