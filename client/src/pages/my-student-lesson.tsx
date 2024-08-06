import { useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useLessonsById } from "../hooks/lessons/useLessonById";
import SelfTesting from "../components/self-testing/self-testing";
import Chat from "../components/chat/chat";
import TabsWrapper from "../components/common/tabs-wrapper/tabs-wrapper";
import withFade from "../hoc/withFade.hoc";
import Checkbox from "@mui/material/Checkbox";
import { useUpdateLessonStatus } from "../hooks/lessons/useUpdateLessonStatus";
import SelfTestSkeleton from "../components/skeletons/self-test-skeleton";
import { useMarkAudioAsRead } from "../hooks/useUpdateTestAudio";
import Notification from "../components/common/notification";

const MyStudentLesson = () => {
  const location = useLocation();

  const lessonDetails: LessonDetails = location.state?.lessonDetails;
  const studentId: string = location.state?.studentId;
  const { data: lesson, isLoading } = useLessonsById(lessonDetails.id!);
  const { mutate: updateLessonStatus } = useUpdateLessonStatus();
  const markAudioAsReadMutation = useMarkAudioAsRead();

  const [checked, setChecked] = useState(lessonDetails.status === "finished");

  const [openNotification, setOpen] = useState(false);
  const [messageNotification, setMessage] = useState('');
  const [severityNotification, setSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  useEffect(() => {
    if (lessonDetails.audioNotification && lessonDetails.testAudioId) {
      markAudioAsReadMutation.mutate(lessonDetails.testAudioId);
      setMessage('שלום לך המורה, אל תשכח לשמוע את האודיו החדש שהתלמיד השאיר לך.');
      setSeverity('info');
      setOpen(true);
      
      const timer = setTimeout(() => {
        setOpen(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [lessonDetails.audioNotification, lessonDetails.testAudioId]);

  const handleClose = () => {
    setOpen(false);
  };

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
      <Notification
        open={openNotification}
        message={messageNotification}
        severity={severityNotification}
        onClose={handleClose}
      />
    </div>
      <div>
        שיעור הושלם בהצלחה
        <Checkbox
          checked={checked}
          onChange={handleChange}
          color="success"
          inputProps={{ "aria-label": "controlled" }}
        />
      </div>
      {isLoading ? <SelfTestSkeleton /> : <TabsWrapper tabs={tabs} />}

      <Chat chatId={lessonDetails.chatId!} />
    </div>
  );
};

export default withFade(MyStudentLesson);
