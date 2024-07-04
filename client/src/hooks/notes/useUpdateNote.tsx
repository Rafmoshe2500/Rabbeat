import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNote } from "../../api/endpoints/notes";

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation<Note, Error, Note>({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessonNotes"] });
    },
  });
};
