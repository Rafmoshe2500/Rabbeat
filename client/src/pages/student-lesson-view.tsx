import BookIcon from "@mui/icons-material/Book";
import QuizIcon from "@mui/icons-material/Quiz";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button } from "@mui/material";
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
    () => ({ ...(lesson || {}), ...(lessonDetails || {}) } as Lesson),
    [lesson, lessonDetails]
  );

  const currentIndex = allLessons.findIndex((lesson) => lesson.id === id);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const navigateToLesson = (lesson: LessonDetails) => {
    navigate(`/lesson/${lesson.id}`, {
      state: { lessonDetails: lesson, allLessons },
    });
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
    <Box
      sx={{
        maxWidth: 1200,
        marginTop: `${lessonDetails.status === "finished" ? "-46px" : 0}`,
        direction: "rtl",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
          justifyContent: "center",
          transform: "translate(2%, 220%)",
        }}
      >
        {lessonDetails.status === "finished" && (
          <button
            style={{
              outline: "none",
              border: "none",
              borderRadius: "50px",
              padding: "10px 20px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#000000",
              background: "linear-gradient(to right, #f3e5ab, #ffc0cb)",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
            onClick={confetti.start}
          >
            קולולו!!!
          </button>
        )}
      </Box>
      {isLoading ? <LessonSkeleton /> : <TabsWrapper tabs={tabs} />}

      <Box sx={{ display: "flex", mt: 2, justifyContent: "space-between" }}>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          {previousLesson && (
            <Button
              sx={{ backgroundColor: "White", outline: "none !important" }}
              startIcon={<ArrowForwardIcon />}
              onClick={() => navigateToLesson(previousLesson)}
            >
              שיעור קודם
            </Button>
          )}
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          {nextLesson && (
            <Button
              sx={{ backgroundColor: "White", outline: "none !important" }}
              endIcon={<ArrowBackIcon />}
              onClick={() => navigateToLesson(nextLesson)}
            >
              שיעור הבא
            </Button>
          )}
        </Box>
      </Box>
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
