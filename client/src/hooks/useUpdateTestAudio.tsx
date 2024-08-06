import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { updateTestAudio, markAudioAsRead } from "../api/endpoints/testAudio";

export const useUpdateTestAudio = (testAudioId: string) => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, string>({
    mutationFn: (testAudio: string) => updateTestAudio(testAudioId, testAudio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testAudio"] });
    },
  });
};

export const useMarkAudioAsRead = (options?: UseMutationOptions<void, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (audioId: string) => markAudioAsRead(audioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    ...options,
  });
};