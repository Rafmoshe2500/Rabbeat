import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNote } from "../../api/endpoints/notes";

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation<Note, Error, { noteId: string; newText: string }>({
    mutationFn: ({ noteId, newText }) => updateNote(noteId, newText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessonNotes"] });
    },
  });
};
