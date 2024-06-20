import { useQuery } from "@tanstack/react-query";
import { getTorahSection } from "../api/endpoints/torah";

const createQueryKey = (
  queryName: string,
  pentateuch: string,
  startCh: string,
  startVerse: string,
  endCh: string,
  endVerse: string
) => {
  return [queryName, pentateuch, startCh, startVerse, endCh, endVerse] as const;
};

type QueryKey = ReturnType<typeof createQueryKey>;

// Fetch lessons by user
export const useTorahSection = (
  pentateuch: string,
  startCh: string,
  startVerse: string,
  endCh: string,
  endVerse: string
) => {
  const queryKey = createQueryKey(
    "lessons",
    pentateuch,
    startCh,
    startVerse,
    endCh,
    endVerse
  );

  return useQuery<TorahSection, Error, TorahSection, QueryKey>({
    queryKey,
    queryFn: (context) =>
      getTorahSection(
        context.queryKey[1],
        context.queryKey[2],
        context.queryKey[3],
        context.queryKey[4],
        context.queryKey[5]
      ),
    enabled: !!pentateuch && !!startCh && !!startVerse && !!endCh && !!endVerse,
  });
};
