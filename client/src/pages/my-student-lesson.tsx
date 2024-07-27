import { useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useLessonsById } from "../hooks/lessons/useLessonById";
import Loader from "../components/common/loader";
import SelfTesting from "../components/self-testing/self-testing";
import Chat from "../components/chat/chat";
import TabsWrapper from "../components/common/tabs-wrapper/tabs-wrapper";
import withFade from "../hoc/withFade.hoc";
import Checkbox from "@mui/material/Checkbox";
import { useUpdateLessonStatus } from "../hooks/lessons/useUpdateLessonStatus";

const MyStudentLesson = () => {
  const location = useLocation();

  const lessonDetails: LessonDetails = location.state?.lessonDetails;
  const studentId: string = location.state?.studentId;
  const { data: lesson, isLoading } = useLessonsById(lessonDetails.id!);
  const { mutate: updateLessonStatus } = useUpdateLessonStatus();

  const [checked, setChecked] = useState(lessonDetails.status === "finished");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;

    updateLessonStatus(
      {
        lessonId: lessonDetails.id!,
        userId: studentId,
        newStatus: isChecked ? "finished" : "in-progress",
      },
      {
        onSuccess: () => setChecked(isChecked),
      }
    );
  };

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
      <div>
        שיעור הושלם בהצלחה
        <Checkbox
          checked={checked}
          onChange={handleChange}
          color="success"
          inputProps={{ "aria-label": "controlled" }}
        />
      </div>
      {isLoading ? <Loader /> : <TabsWrapper tabs={tabs} />}

      <Chat chatId={lessonDetails.chatId!} />
    </div>
  );
};

export default withFade(MyStudentLesson);
