import { useLocation } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { useLessonsById } from '../hooks/lessons/useLessonById';
import SelfTesting from '../components/self-testing/self-testing';
import Chat from '../components/chat/chat';
import TabsWrapper from '../components/common/tabs-wrapper/tabs-wrapper';
import withFade from '../hoc/withFade.hoc';
import Checkbox from '@mui/material/Checkbox';
import { useUpdateLessonStatus } from '../hooks/lessons/useUpdateLessonStatus';
import SelfTestSkeleton from '../components/skeletons/self-test-skeleton';
import { useMarkAudioAsRead } from '../hooks/useUpdateTestAudio';
import Notification from '../components/common/notification';
import useNotification from '../hooks/useNotification';
import useToaster from '../hooks/useToaster';
import Toaster from '../components/common/toaster';

const MyStudentLesson = () => {
  const location = useLocation();

  const lessonDetails: LessonDetails = location.state?.lessonDetails;
  const studentId: string = location.state?.studentId;
  const { data: lesson, isLoading } = useLessonsById(lessonDetails.id!);
  const { mutate: updateLessonStatus } = useUpdateLessonStatus();
  const markAudioAsReadMutation = useMarkAudioAsRead();

  const [checked, setChecked] = useState(lessonDetails.status === 'finished');
  const { toaster, setToaster, handleCloseToaster } = useToaster();

  const { notification, setNotification, handleCloseNotification } =
    useNotification();

  useEffect(() => {
    if (lessonDetails.audioNotification && lessonDetails.testAudioId) {
      markAudioAsReadMutation.mutate(lessonDetails.testAudioId);

      setNotification({
        isOpen: true,
        message: [
          'שלום לך המורה, אל תשכח לשמוע את האודיו החדש שהתלמיד השאיר לך.',
        ],
        severity: 'success',
      });

      const timer = setTimeout(() => {
        handleCloseNotification();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [lessonDetails.audioNotification, lessonDetails.testAudioId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;

    updateLessonStatus(
      {
        lessonId: lessonDetails.id!,
        userId: studentId,
        newStatus: isChecked ? 'finished' : 'in-progress',
      },
      {
        onSuccess: () => {
          setChecked(isChecked);
          setToaster({
            open: true,
            message: 'הסטטוס עודכן בהצלחה.',
            color: 'success',
          });
        },
        onError: () => {
          setToaster({
            open: true,
            message: 'משהו השתבש בעת עדכון הסטטוס.',
            color: 'error',
          });
        },
      }
    );
  };

  const lessonForView = useMemo(
    () =>
      ({
        ...(lesson || {}),
        ...(lessonDetails || {}),
      }) as Lesson,
    [lesson, lessonDetails]
  );

  const tabs = [
    {
      name: 'בחינה עצמית',
      component: <SelfTesting lesson={lessonForView} />,
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>
        <Notification
          open={notification.isOpen}
          message={notification.message}
          severity={notification.severity}
          onClose={handleCloseNotification}
        />
      </div>
      {lessonDetails.status !== 'not-started' ? (
        <div>
          שיעור הושלם בהצלחה
          <Checkbox
            checked={checked}
            onChange={handleChange}
            color="success"
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>) : (
          <>
          <span>התלמיד עוד לא התחיל את השיעור</span>
          </>      
      )}
      {isLoading ? <SelfTestSkeleton /> : <TabsWrapper tabs={tabs} />}

      <Chat chatId={lessonDetails.chatId!} />
      <Toaster
        message={toaster.message}
        open={toaster.open}
        color={toaster.color}
        onClose={handleCloseToaster}
      />
    </div>
  );
};

export default withFade(MyStudentLesson);
