import BookIcon from "@mui/icons-material/Book";
import QuizIcon from "@mui/icons-material/Quiz";
import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { useLocation, useParams } from "react-router-dom";
import Chat from "../components/chat/chat";
import ChatComponent from "../components/chatbot/ChatComponent";
import TabsWrapper from "../components/common/tabs-wrapper/tabs-wrapper";
import LessonContent from "../components/lessons/lesson-content/lesson-content";
import SelfTesting from "../components/self-testing/self-testing";
import { useUser } from "../contexts/user-context";
import withFade from "../hoc/withFade.hoc";
import { useLessonsById } from "../hooks/lessons/useLessonById";
import { useUpdateLessonStatus } from "../hooks/lessons/useUpdateLessonStatus";
import LessonSkeleton from "../components/skeletons/lesson-skeleton";

const LessonView = () => {
  const { userDetails } = useUser();
  const location = useLocation();
  const lessonDetails: LessonDetails = location.state?.lessonDetails;
  const { id } = useParams<{ id: string }>();
  const { data: lesson, isLoading } = useLessonsById(id!);
  const { mutate: updateLessonStatus } = useUpdateLessonStatus();

  useEffect(() => {
    if (lessonDetails.status === "not-started") {
      updateLessonStatus({
        lessonId: lessonDetails.id!,
        userId: userDetails?.id!,
        newStatus: "in-progress",
      });
    }
  }, []);

  const lessonForView = useMemo(
    () => ({ ...(lesson || {}), ...(lessonDetails || {}) } as Lesson),
    [lesson, lessonDetails]
  );

  const tabs = [
    {
      name: "לימוד",
      component: <LessonContent lesson={lessonForView} />,
      icon: <BookIcon />,
    },
    {
      name: "בחינה עצמית",
      component: <SelfTesting lesson={lessonForView} />,
      icon: <QuizIcon />,
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, direction: "rtl" }}>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {lessonDetails.status! === "finished" ? (
          <ConfettiExplosion
            particleCount={200}
            zIndex={1000}
            duration={5000}
          />
        ) : (
          <></>
        )}
      </Box>
      <Paper elevation={3} sx={{ padding: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          {lessonForView.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {`${lessonForView.pentateuch} ${lessonForView.startChapter}:${lessonForView.startVerse} - ${lessonForView.endChapter}:${lessonForView.endVerse}`}
        </Typography>
        {isLoading ? <LessonSkeleton /> : <TabsWrapper tabs={tabs} />}
      </Paper>
      <Chat chatId={lessonDetails.chatId!} />
      <ChatComponent
        messageContext={{
          pentateuch: lessonDetails.pentateuch,
          startChapter: lessonDetails.startChapter,
          startVerse: lessonDetails.startVerse,
          endChapter: lessonDetails.endChapter,
          endVerse: lessonDetails.endVerse,
        }}
      />
    </Box>
  );
};

export default withFade(LessonView);
