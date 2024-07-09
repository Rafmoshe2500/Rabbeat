import { useQuery } from "@tanstack/react-query";
import { compareTexts } from "../api/endpoints/torah";

const createQueryKey = (
  queryName: string,
  sourceText: string,
  testedText: string
) => [queryName, sourceText, testedText] as const;

export const useCompareTexts = (sourceText: string, testedText: string) => {
  const queryKey = createQueryKey("compareTexts", sourceText, testedText);
  return useQuery<Words, Error, Words, ReturnType<typeof createQueryKey>>({
    queryKey,
    queryFn: (context) =>
      compareTexts(context.queryKey[1], context.queryKey[2]),
    enabled: false,
  });
};
