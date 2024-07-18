import { useLocation, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import { useLessonsById } from "../hooks/useLessonById";
import LessonContent from "../components/lessons/lesson-content/lesson-content";
import Loader from "../components/common/loader";
import ChatComponent from "../components/chatbot/ChatComponent";
// import SelfLearning from "../components/self-learning/self-learning"; // Import your SelfLearning component
import SelfTesting from "./self-testing";
import TabsWrapper from "../components/common/tabs-wrapper/tabs-wrapper";

const LessonView = () => {
  const location = useLocation();
  const lessonDetails: LessonDetails = location.state?.lessonDetails;
  const { id } = useParams<{ id: string }>();
  const { data: lesson, isLoading } = useLessonsById(id!);

  const lessonForView = useMemo(
    () =>
      ({
        ...(lesson || {}),
        ...(lessonDetails || {}),
      } as Lesson),
    [lesson, lessonDetails]
  );

  const tabs = [
    {
      name: "מסך למידה",
      component: <LessonContent lesson={lessonForView} />,
    },
    {
      name: "בחינה עצמית",
      component: <SelfTesting lesson={lessonForView} />,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoading ? <Loader /> : <TabsWrapper tabs={tabs} />}

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
