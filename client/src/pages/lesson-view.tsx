import { useLocation, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import { useLessonsById } from "../hooks/useLessonById";
import LessonContent from "../components/lessons/lesson-content/lesson-content";
import Loader from "../components/common/loader";
import ChatComponent from "../components/chatbot/ChatComponent";
// import SelfLearning from "../components/self-learning/self-learning"; // Import your SelfLearning component
import SelfTesting from "./self-testing";

const LessonView = () => {
  const location = useLocation();
  const lessonDetails: LessonDetails = location.state?.lessonDetails;
  const { id } = useParams<{ id: string }>();

  const { data: lesson, isLoading } = useLessonsById(id!);
  const [currentView, setCurrentView] = useState<
    "LessonContent" | "SelfTesting"
  >("LessonContent");

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
      <div style={{ marginBottom: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCurrentView("LessonContent")}
        >
          מסך למידה
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setCurrentView("SelfTesting")}
        >
          בחינה עצמית
        </Button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {currentView === "LessonContent" && (
            <LessonContent lesson={lessonForView} />
          )}
          {currentView === "SelfTesting" && (
            <SelfTesting lesson={lessonForView} />
          )}
        </>
      )}

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
