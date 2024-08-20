import { useEffect, useState } from "react";
import DisplayText from "../display-lesson-text/display-lesson-text";
import { useFlattedLessonText } from "../../hooks/lessons/useFlattedLessonText";
import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import AudioRecorder from "../audio-recorder/audio-recorder";
import { useUpdateTestAudio } from "../../hooks/useUpdateTestAudio";
import { convertBlobToBase64 } from "../../utils/audio-parser";
import styles from "./self-testing.module.scss";
import { useTestAudio } from "../../hooks/useTestAudio";
import { useUser } from "../../contexts/user-context";
import AnimatedButton from "../common/animated-button";
import withFade from "../../hoc/withFade.hoc";
import { useNavigate } from "react-router-dom";
import theme from "../../theme";
import { formatVerseReference } from '../../utils/utils';
import { useCompareAudio } from "../../hooks/useTestAudio";
import Notification from "../common/notification";

type SelfTestingProps = {
  lesson?: Lesson;
};


const SelfTesting = ({ lesson }: SelfTestingProps) => {
  const { userDetails } = useUser();
  const { flattedText, length } = useFlattedLessonText(lesson?.text);
  const updateTestAudioMutation = useUpdateTestAudio(lesson?.testAudioId!);
  const { data: testAudio } = useTestAudio(lesson?.testAudioId!);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const formattedString = formatVerseReference(lesson!.startChapter,
                                                lesson!.endChapter,
                                                lesson!.startVerse, 
                                                lesson!.endVerse);
  
  const compareAudioMutation = useCompareAudio();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string[]>([]);
  const [notificationSeverity, setNotificationSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  useEffect(() => {
    if (testAudio) {
      const url = URL.createObjectURL(testAudio);
      setAudioUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [lesson?.testAudioId, testAudio]);

  useEffect(() => {
    if (compareAudioMutation.isSuccess) {
        const { score, feedback } = compareAudioMutation.data;
        let notificationSeverity: 'success' | 'error' | 'info' | 'warning' = 'info';
        if (score <= 50) {
            notificationSeverity = 'error';
        } else if (score <= 70) {
            notificationSeverity = 'warning';
        } else {
            notificationSeverity = 'success';
        }
        setNotificationMessage([...feedback, '<b> אל תשכח לשמור את האודיו כדי שהמורה יוכל לבדוק אותו. </b>']);
        setNotificationSeverity(notificationSeverity);
        setNotificationOpen(true);
    } else if (compareAudioMutation.isError) {
        setNotificationMessage(["Error comparing audio. Please try again."]);
        setNotificationSeverity('error');
        setNotificationOpen(true);
    }
  }, [compareAudioMutation.isSuccess, compareAudioMutation.isError, compareAudioMutation.data]);

  const handleRecordingComplete = async (audioBlob: Blob, transcript: string) => {
    setAudioBlob(audioBlob);

    const base64Audio = await convertBlobToBase64(audioBlob);

    compareAudioMutation.mutate({
        sourceText: flattedText,
        sttText: transcript,
        testAudio: base64Audio,
        lessonId: lesson?.id || '',
    });
  };

  const shouldStopRecording = (transcript: string) => {
    const transcriptWords = transcript.split(" ");
    return transcriptWords.length === length + 3;
  };

  const handleUpload = async () => {
    const convertedAudio = await convertBlobToBase64(audioBlob!);
    updateTestAudioMutation.mutate(convertedAudio, {
      onSuccess: () => {
        setIsSuccess(true);
        console.log(isSuccess);
        setTimeout(() => {
          navigate("/student-personal-area");
        }, 1000);
      },
    });
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  return (
    <div>
      <Box
        mr={"10px"}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5">{lesson?.title}</Typography>
        <Typography variant="subtitle1" gutterBottom>
          {`${lesson?.pentateuch} - `}
          {formattedString}
        </Typography>
      </Box>
      <Container
        maxWidth="md"
        sx={{
          marginLeft: isMobile ? 0 : 24,
          marginRight: isMobile ? 0 : 24,
          width: isMobile ? "100%" : "auto",
        }}
      >
        {lesson && <DisplayText text={lesson.text!} />}
      </Container>

      {userDetails?.type !== "teacher" && (
        <div className={styles["record-container"]}>
          {audioBlob && (
            <AnimatedButton
              onClick={handleUpload}
              buttonText="שמור"
              isLoading={updateTestAudioMutation.isPending}
            />
          )}
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            shouldStopRecording={shouldStopRecording}
            shouldDisplayTranscript
          />
        </div>
      )}
      {audioUrl && !audioBlob && (
        <audio controls>
          <source src={audioUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}

      {compareAudioMutation.isPending && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <CircularProgress />
          <Typography ml={2}>Comparing audio...</Typography>
        </Box>
      )}

      <Notification
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        onClose={handleNotificationClose}
      />
    </div>
  );
};

export default withFade(SelfTesting);