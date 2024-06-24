import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserOrUpdate } from "../api/endpoints/user";

export const useCreateOrUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, User>({
    mutationFn: createUserOrUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
