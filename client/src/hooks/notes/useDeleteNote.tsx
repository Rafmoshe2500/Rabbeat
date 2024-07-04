import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../api/endpoints/notes";

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessonNotes"] });
    },
  });
};
