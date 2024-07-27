import { useMutation } from "@tanstack/react-query";
import { updateLessonStatus } from "../../api/endpoints/lesson";

export const useUpdateLessonStatus = () => {

  return useMutation<
    Boolean,
    Error,
    { lessonId: string; userId: string; newStatus: LessonStatus }
  >({
    mutationFn: ({ lessonId, userId, newStatus }) =>
      updateLessonStatus(lessonId, userId, newStatus),
    onSuccess: () => {
      //   queryClient.invalidateQueries({ queryKey: ["lessonNotes"] });
    },
  });
};
