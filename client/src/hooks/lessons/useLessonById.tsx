import { useQuery } from "@tanstack/react-query";
import { getLessonsById } from "../../api/endpoints/lesson";

const createQueryKey = (queryName: string, lessonId: string) => {
  return [queryName, lessonId] as const;
};

type QueryKey = ReturnType<typeof createQueryKey>;

// Fetch lessons by user
export const useLessonsById = (lessonId: string) => {
  const queryKey = createQueryKey("lessons", lessonId);

  return useQuery<LessonContent, Error, LessonContent, QueryKey>({
    queryKey,
    queryFn: (context) => getLessonsById(context.queryKey[1]),
  });
};
