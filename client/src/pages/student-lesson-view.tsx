import BookIcon from "@mui/icons-material/Book";
import QuizIcon from "@mui/icons-material/Quiz";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Paper, Typography, Button } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
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
import { confetti } from "../utils/confetti";

const StudentLessonView = () => {
  const { userDetails } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const { lessonDetails, allLessons } = location.state as { 
    lessonDetails: LessonDetails; 
    allLessons: LessonDetails[]; 
  };
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
    } else if (lessonDetails.status === "finished") {
      confetti.start();
    }
  }, [lessonDetails, updateLessonStatus, userDetails]);

  const lessonForView = useMemo(
    () => ({ ...(lesson || {}), ...(lessonDetails || {}) }) as Lesson,
    [lesson, lessonDetails]
  );

  const currentIndex = allLessons.findIndex((lesson) => lesson.id === id);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const navigateToLesson = (lesson: LessonDetails) => {
    navigate(`/lesson/${lesson.id}`, { state: { lessonDetails: lesson, allLessons } });
  };

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
        {lessonDetails.status === "finished" && (
          <button style={{ outline: "none" }} onClick={confetti.start}>
            קולולו!!!
          </button>
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

    <Box sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        {previousLesson && (
          <Button
            startIcon={<ArrowForwardIcon />}
            onClick={() => navigateToLesson(previousLesson)}
          >
            שיעור קודם
          </Button>
        )}
      </Box>
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        {nextLesson && (
          <Button
            endIcon={<ArrowBackIcon />}
            onClick={() => navigateToLesson(nextLesson)}
          >
            שיעור הבא
          </Button>
        )}
      </Box>
    </Box>
      </Paper>
      <Chat chatId={lessonDetails.chatId!} title={lessonDetails.title} />
      <ChatComponent
        title={lessonDetails.title}
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

export default withFade(StudentLessonView);