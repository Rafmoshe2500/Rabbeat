import { useQuery } from "@tanstack/react-query";
import { getTorahParashot } from "../api/endpoints/torah";

const createQueryKey = (queryName: string, parasha: string, alia: string) => {
  return [queryName, parasha, alia] as const;
};

type QueryKey = ReturnType<typeof createQueryKey>;

export const UseAlia = (parasha: string, alia: string) => {
  const queryKey = createQueryKey("alia", parasha, alia);

  return useQuery<messageContext, Error, messageContext, QueryKey>({
    queryKey,
    queryFn: (context) =>
      getTorahParashot(context.queryKey[1], context.queryKey[2]),
    enabled: !!parasha && !!alia,
  });
};
