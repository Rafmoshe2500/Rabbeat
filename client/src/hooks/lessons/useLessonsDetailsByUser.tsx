import { useQuery } from "@tanstack/react-query";
import { getLessonsDetailsByUser } from "../../api/endpoints/lesson";

const createQueryKey = (queryName: string, userId: string) => {
  return [queryName, userId] as const;
};

type QueryKey = ReturnType<typeof createQueryKey>;

// Fetch lessons by user
export const useLessonsDetailsByUser = (userId: string) => {
  const queryKey = createQueryKey("lessonsDetails", userId);

  return useQuery<LessonDetails[], Error, LessonDetails[], QueryKey>({
    queryKey,
    queryFn: (context) => getLessonsDetailsByUser(context.queryKey[1]),
  });
};
