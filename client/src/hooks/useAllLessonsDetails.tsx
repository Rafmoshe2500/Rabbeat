import { useQuery } from "@tanstack/react-query";
import { getAllLessonsDetails } from "../api/endpoints/lesson";

const createQueryKey = (keys: string[]) => [...keys] as const;

export const useAllLessonsDetails = () => {
  const queryKey = createQueryKey(["allLessons"]);
  return useQuery<LessonDetails[], Error>({
    queryKey,
    queryFn: getAllLessonsDetails,
  });
};
