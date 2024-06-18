import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrUpdateLesson } from "../api/endpoints/lesson";

export const useCreateOrUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation<Lesson, Error, Lesson>({
    mutationFn: createOrUpdateLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allLessons"] });
    },
  });
};
