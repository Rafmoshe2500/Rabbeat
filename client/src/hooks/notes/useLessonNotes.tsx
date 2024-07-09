import { useQuery } from "@tanstack/react-query";
import { getLessonNotes } from "../../api/endpoints/notes";

const createQueryKey = (queryName: string, userId: string, lessonId: string) =>
  [queryName, userId, lessonId] as const;

type QueryKey = ReturnType<typeof createQueryKey>;

export const useLessonNotes = (userId: string, lessonId: string) => {
  const queryKey = createQueryKey("lessonNotes", userId, lessonId);
  return useQuery<Note[], Error, Note[], QueryKey>({
    queryKey,
    queryFn: (context) =>
      getLessonNotes(context.queryKey[1], context.queryKey[2]),
  });
};
