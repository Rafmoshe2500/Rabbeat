import { Box, Paper } from "@mui/material";
import { useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import LessonContent from "../components/lessons/lesson-content/lesson-content";
import withFade from "../hoc/withFade.hoc";
import { useLessonsById } from "../hooks/lessons/useLessonById";
import LessonSkeleton from "../components/skeletons/lesson-skeleton";

const TeacherLessonView = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const passedLessonDetails = location.state?.lessonDetails;
  
  const { data: lesson, isLoading } = useLessonsById(id!);
  
  const lessonForView = useMemo(
    () => ({ ...(lesson || {}), ...(passedLessonDetails || {}) } as Lesson),
    [lesson, passedLessonDetails]
  );

  if (isLoading && !passedLessonDetails) {
    return <LessonSkeleton />;
  }
  
  console.log(lessonForView);

  return (
    <Box sx={{ maxWidth: 1200, direction: "rtl" }}>
      <Paper elevation={3} sx={{ padding: "2rem" }}>
        <LessonContent lesson={lessonForView} />
      </Paper>
    </Box>
  );
};

export default withFade(TeacherLessonView);