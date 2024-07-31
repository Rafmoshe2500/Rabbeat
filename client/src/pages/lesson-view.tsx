import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useLessonsById } from "../hooks/lessons/useLessonById";
import LessonContent from "../components/lessons/lesson-content/lesson-content";
import Loader from "../components/common/loader";
import ChatComponent from "../components/chatbot/ChatComponent";
import SelfTesting from "../components/self-testing/self-testing";
import Chat from "../components/chat/chat";
import withFade from "../hoc/withFade.hoc";
import { useUpdateLessonStatus } from "../hooks/lessons/useUpdateLessonStatus";
import { useUser } from "../contexts/user-context";
import ConfettiExplosion from "react-confetti-explosion";
import { Box, Paper, Tab, Tabs, Typography, Button, Grid } from "@mui/material";
import BookIcon from '@mui/icons-material/Book';
import QuizIcon from '@mui/icons-material/Quiz';
import ChatIcon from '@mui/icons-material/Chat';

const LessonView = () => {
  const { userDetails } = useUser();
  const location = useLocation();
  const lessonDetails: LessonDetails = location.state?.lessonDetails;
  const { id } = useParams<{ id: string }>();
  const { data: lesson, isLoading } = useLessonsById(id!);
  const { mutate: updateLessonStatus } = useUpdateLessonStatus();
  const [activeTab, setActiveTab] = useState(0);

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
    () => ({ ...(lesson || {}), ...(lessonDetails || {}) } as Lesson),
    [lesson, lessonDetails]
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isLoading) return <Loader />;

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      {lessonDetails.status === "finished" && (
        <ConfettiExplosion particleCount={200} duration={5000} />
      )}
      
      <Paper elevation={3} sx={{ padding: '2rem', marginBottom: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          {lessonForView.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {`${lessonForView.pentateuch} ${lessonForView.startChapter}:${lessonForView.startVerse} - ${lessonForView.endChapter}:${lessonForView.endVerse}`}
        </Typography>
        
        <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ marginBottom: '2rem' }}>
          <Tab icon={<BookIcon />} label="לימוד" />
          <Tab icon={<QuizIcon />} label="בחינה עצמית" />
          <Tab icon={<ChatIcon />} label="צ'אט" />
        </Tabs>

        <Box sx={{ minHeight: '400px' }}>
          {activeTab === 0 && <LessonContent lesson={lessonForView} />}
          {activeTab === 1 && <SelfTesting lesson={lessonForView} />}
          {activeTab === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: '500px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                  <Chat chatId={lessonDetails.chatId!} />
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
                  <ChatComponent
                    messageContext={{
                      pentateuch: lessonDetails.pentateuch,
                      startChapter: lessonDetails.startChapter,
                      startVerse: lessonDetails.startVerse,
                      endChapter: lessonDetails.endChapter,
                      endVerse: lessonDetails.endVerse,
                    }}
                  />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => updateLessonStatus({
            lessonId: lessonDetails.id!,
            userId: userDetails?.id!,
            newStatus: "finished",
          })}
          disabled={lessonDetails.status === "finished"}
        >
          סיים שיעור
        </Button>
      </Box>
    </Box>
  );
};

export default withFade(LessonView);