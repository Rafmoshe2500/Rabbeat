import { useQuery } from "@tanstack/react-query";
import { getSharedLessonsDetails } from "../../api/endpoints/lesson";

const createQueryKey = (
  queryName: string,
  teacherId: string,
  studentId: string
) => {
  return [queryName, teacherId, studentId] as const;
};

type QueryKey = ReturnType<typeof createQueryKey>;

export const useStudentLessonsByTeacher = (
  teacherId: string,
  studentId: string
) => {
  const queryKey = createQueryKey(
    "lessonsDetailsByTeacher",
    teacherId,
    studentId
  );

  return useQuery<LessonDetails[], Error, LessonDetails[], QueryKey>({
    queryKey,
    queryFn: (context) =>
      getSharedLessonsDetails(context.queryKey[1], context.queryKey[2]),
  });
};
