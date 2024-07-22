import { useQuery } from "@tanstack/react-query";
import { getTestAudio } from "../api/endpoints/testAudio";

const createQueryKey = (name: string, testAudioId: string) =>
  [name, testAudioId] as const;

type QueryKey = ReturnType<typeof createQueryKey>;

export const useTestAudio = (testAudioId: string) => {
  const queryKey = createQueryKey("testAudio", testAudioId);

  return useQuery<Blob, Error, Blob, QueryKey>({
    queryKey,
    queryFn: (context) => getTestAudio(context.queryKey[1]),
  });
};
