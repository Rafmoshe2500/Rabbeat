import { useLocation, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useLessonsById } from "../hooks/lessons/useLessonById";
import LessonContent from "../components/lessons/lesson-content/lesson-content";
import Loader from "../components/common/loader";
import ChatComponent from "../components/chatbot/ChatComponent";
import SelfTesting from "../components/self-testing/self-testing";
import Chat from "../components/chat/chat";
import TabsWrapper from "../components/common/tabs-wrapper/tabs-wrapper";
import withFade from "../hoc/withFade.hoc";
import { useUpdateLessonStatus } from "../hooks/lessons/useUpdateLessonStatus";
import { useUser } from "../contexts/user-context";

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
      <Chat chatId={lessonDetails.chatId!} />
    </div>
  );
};

export default withFade(LessonView);
