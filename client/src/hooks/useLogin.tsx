import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/endpoints/user";

const createQueryKey = (queryName: string, userId: string) => {
  return [queryName, userId] as const;
};

type QueryKey = ReturnType<typeof createQueryKey>;

export const useLessonsByUser = (userId: string) => {
  const queryKey = createQueryKey("user", userId);

  return useQuery<User, Error, any, QueryKey>({
    queryKey,
    queryFn: (context) => getUser(context.queryKey[1]),
  });
};
