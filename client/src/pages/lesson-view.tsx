import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { useLessonsById } from "../hooks/useLessonById";
import { useTorahSection } from "../hooks/useTorahSection";
import LessonContent from "../components/lessons/lesson-content/lesson-content";
import Loader from "../components/common/loader";
import { useMemo } from "react";
import ChatComponent from "../components/chatbot/ChatComponent";

const LessonView = () => {
  const location = useLocation();
  const lessonDetails: LessonDetailsWIthStatus = location.state?.lessonDetails;
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const { data: lesson, isLoading, isError } = useLessonsById(id!);

  const {
    data: text,
    isLoading: isLoadingText,
    isError: isTextError,
  } = useTorahSection(
    lessonDetails?.pentateuch || "",
    lessonDetails?.startChapter || "",
    lessonDetails?.startVerse || "",
    lessonDetails?.endChapter || "",
    lessonDetails?.endVerse || ""
  );

  const convertedLesson = lesson
    ? {
        audio: lesson?.audio,
        text: text,
        highlightsTimestamps: lesson.highlightsTimestamps,
      }
    : undefined;

  const handleNavigate = () => {
    navigate("/student-self-testing", { state: { lesson: convertedLesson } });
  };

  const lessonForView = useMemo(
    () =>
      ({
        ...(lesson || {}),
        ...(lessonDetails || {}),
        text: text || {},
      } as LessonForView),
    [lesson, lessonDetails, text]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoadingText || isLoading ? (
        <Loader />
      ) : (
        <LessonContent lesson={lessonForView} />
      )}

      <Button variant="contained" color="primary" onClick={handleNavigate}>
        עבור לנסיון
      </Button>
      <ChatComponent />
    </div>
  );
};

export default LessonView;
