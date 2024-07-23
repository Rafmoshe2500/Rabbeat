import { useQuery } from "@tanstack/react-query";
import { getAllLessons } from "../../api/endpoints/lesson";

const createQueryKey = (keys: string[]) => [...keys] as const;

export const useAllLessons = () => {
  const queryKey = createQueryKey(["allLessons"]);
  return useQuery<Lesson[], Error>({
    queryKey,
    queryFn: getAllLessons,
  });
};
