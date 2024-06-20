import { useQuery } from "@tanstack/react-query";
import { getLessonsByUser } from "../api/endpoints/lesson";

const createQueryKey = (queryName: string, userId: string) => {
  return [queryName, userId] as const;
};

type QueryKey = ReturnType<typeof createQueryKey>;

// Fetch lessons by user
export const useLessonsByUser = (userId: string) => {
  const queryKey = createQueryKey("lessons", userId);

  return useQuery<Lesson[], Error, any, QueryKey>({
    queryKey,
    queryFn: (context) => getLessonsByUser(context.queryKey[1]),
  });
};
