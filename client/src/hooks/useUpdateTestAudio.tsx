import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTestAudio } from "../api/endpoints/testAudio";

export const useUpdateTestAudio = (testAudioId: string) => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, string>({
    mutationFn: (testAudio: string) => updateTestAudio(testAudioId, testAudio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testAudio"] });
    },
  });
};
