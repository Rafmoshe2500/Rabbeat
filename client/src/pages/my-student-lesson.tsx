import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useLessonsById } from "../hooks/lessons/useLessonById";
import Loader from "../components/common/loader";
import SelfTesting from "../components/self-testing/self-testing";
import Chat from "../components/chat/chat";
import TabsWrapper from "../components/common/tabs-wrapper/tabs-wrapper";
import withFade from "../hoc/withFade.hoc";

const MyStudentLesson = () => {
  const location = useLocation();
  const lessonDetails: LessonDetails = location.state?.lessonDetails;
  const { data: lesson, isLoading } = useLessonsById(lessonDetails.id!);

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

      <Chat chatId={lessonDetails.chatId!} />
    </div>
  );
};

export default withFade(MyStudentLesson);
