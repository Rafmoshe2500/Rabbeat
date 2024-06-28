import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { useLessonsById } from "../hooks/useLessonById";
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

  const handleNavigate = () => {
    navigate("/student-self-testing", { state: { lesson: lesson } });
  };

  const lessonForView = useMemo(
    () =>
      ({
        ...(lesson || {}),
        ...(lessonDetails || {}),
      } as Lesson),
    [lesson, lessonDetails]
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
      {isLoading ? <Loader /> : <LessonContent lesson={lessonForView} />}

      <Button variant="contained" color="primary" onClick={handleNavigate}>
        עבור לנסיון
      </Button>
      <ChatComponent
        messageContext={{
          pentateuch: lessonDetails.pentateuch,
          startChapter: lessonDetails.startChapter,
          startVerse: lessonDetails.startVerse,
          endChapter: lessonDetails.endChapter,
          endVerse: lessonDetails.endVerse,
        }}
      />
    </div>
  );
};

export default LessonView;
