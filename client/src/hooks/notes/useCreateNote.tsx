import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../api/endpoints/notes";

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation<Note, Error, Omit<Note, "id">>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessonNotes"] });
    },
  });
};
