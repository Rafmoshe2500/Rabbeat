import { useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useLessonsById } from "../hooks/lessons/useLessonById";
import LessonContent from "../components/lessons/lesson-content/lesson-content";
import Loader from "../components/common/loader";
import ChatComponent from "../components/chatbot/ChatComponent";
import SelfTesting from "../components/self-testing/self-testing";
import Chat from "../components/chat/chat";
import withFade from "../hoc/withFade.hoc";
import { useUpdateLessonStatus } from "../hooks/lessons/useUpdateLessonStatus";
import { useUser } from "../contexts/user-context";
import ConfettiExplosion from "react-confetti-explosion";
import { Box, Paper, Typography } from "@mui/material";
import BookIcon from '@mui/icons-material/Book';
import QuizIcon from '@mui/icons-material/Quiz';
import TabsWrapper from "../components/common/tabs-wrapper/tabs-wrapper";

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

  if (isLoading) return <Loader />;

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

  if (isLoading) return <Loader />;

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <Paper elevation={3} sx={{ padding: '2rem', marginBottom: '2rem' }}>
      <Typography variant="h4" gutterBottom>
          {lessonForView.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {`${lessonForView.pentateuch} ${lessonForView.startChapter}:${lessonForView.startVerse} - ${lessonForView.endChapter}:${lessonForView.endVerse}`}
        </Typography>
      {isLoading ? <Loader /> : <TabsWrapper tabs={tabs} />}
        
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