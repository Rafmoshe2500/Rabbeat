import { useEffect, useState } from "react";
import DisplayText from "../display-lesson-text/display-lesson-text";
import { useFlattedLessonText } from "../../hooks/lessons/useFlattedLessonText";
import {
  Backdrop,
  Box,
  Container,
  Typography,
  useMediaQuery,
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
import { formatVerseReference } from "../../utils/utils";
import { useCompareAudio } from "../../hooks/useTestAudio";
import Notification from "../common/notification";
import { confetti } from "../../utils/confetti";
import useToaster from "../../hooks/useToaster";
import Toaster from "../common/toaster";
import CubeLoader from "../common/analysis-loader";
import Loader from "../common/loader";
import useNotification from "../../hooks/useNotification";

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
  const [loading, setLoading] = useState(false);
  const formattedString = formatVerseReference(
    lesson!.startChapter,
    lesson!.endChapter,
    lesson!.startVerse,
    lesson!.endVerse
  );

  const compareAudioMutation = useCompareAudio();
  const { toaster, setToaster, handleCloseToaster } = useToaster();
  const { notification, setNotification, handleCloseNotification } =
    useNotification();

  useEffect(() => {
    if (isMobile) {
      setNotification({
        isOpen: true,
        message: ["שים לב שחלק מיכולות בחינה עצמית אינן פעילות במכשיר הסלולרי"],
        severity: "info",
      });
    }
  }, []);

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
      let notificationSeverity: "success" | "error" | "info" | "warning" =
        "info";
      if (score <= 50) {
        notificationSeverity = "error";
      } else if (score <= 70) {
        notificationSeverity = "warning";
      } else {
        confetti.start();
        notificationSeverity = "success";
      }
      setNotification({
        isOpen: true,
        message: [
          ...feedback,
          "<b> אל תשכח לשמור את האודיו כדי שהמורה יוכל לבדוק אותו. </b>",
        ],
        severity: notificationSeverity,
      });
    } else if (compareAudioMutation.isError) {
      setNotification({
        isOpen: true,
        message: ["התרחשה תקלה. בבקשה נסה שנית."],
        severity: "error",
      });
    }
  }, [
    compareAudioMutation.isSuccess,
    compareAudioMutation.isError,
    compareAudioMutation.data,
  ]);

  const handleRecordingComplete = async (
    audioBlob: Blob,
    transcript: string
  ) => {
    setAudioBlob(audioBlob);

    const base64Audio = await convertBlobToBase64(audioBlob);

    !isMobile &&
      compareAudioMutation.mutate({
        sourceText: flattedText,
        sttText: transcript,
        testAudio: base64Audio,
        lessonId: lesson?.id || "",
      });
  };

  const shouldStopRecording = (transcript: string) => {
    const transcriptWords = transcript.split(" ");
    return transcriptWords.length === length + 3;
  };

  const handleUpload = async () => {
    const convertedAudio = await convertBlobToBase64(audioBlob!);
    setLoading(true);
    updateTestAudioMutation.mutate(convertedAudio, {
      onSuccess: () => {
        setIsSuccess(true);
        setLoading(false);
        setToaster({
          open: true,
          message: "נשמר ושלח לבדיקת המורה.",
          color: "success",
        });
        console.log(isSuccess);
        setTimeout(() => {
          navigate("/student-personal-area");
        }, 1000);
      },
      onError: () => {
        setLoading(false);
        setToaster({
          open: true,
          message: "אופס, התרחשה בעיה. נסה שוב.",
          color: "error",
        });
      },
    });
  };

  if (loading)
    return <Loader message="מעלה את הבדיקה שלך  כדי שהמורה יוכל לבדוק." />;

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={compareAudioMutation.isPending}
      >
        <CubeLoader />
      </Backdrop>

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
          paddingLeft: isMobile ? 0 : "16px",
          paddingRight: isMobile ? 0 : "16px",
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

      <Notification
        open={notification.isOpen}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />
      <Toaster
        message={toaster.message}
        open={toaster.open}
        color={toaster.color}
        onClose={handleCloseToaster}
      />
    </div>
  );
};

export default withFade(SelfTesting);
