import { useEffect, useState } from "react";
import DisplayText from "../display-lesson-text/display-lesson-text";
import { useFlattedLessonText } from "../../hooks/lessons/useFlattedLessonText";
import { useCompareTexts } from "../../hooks/useCompareTexts";
import {
  Box,
  CircularProgress,
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
import { confetti } from "../../utils/confetti";

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
  const [transcript, setTranscript] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const formattedString = formatVerseReference(
    lesson!.startChapter,
    lesson!.endChapter,
    lesson!.startVerse,
    lesson!.endVerse
  );
  useEffect(() => {
    if (testAudio) {
      const url = URL.createObjectURL(testAudio);
      setAudioUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [lesson?.testAudioId, testAudio]);

  const { data, isLoading, refetch } = useCompareTexts(flattedText, transcript);

  const handleRecordingComplete = (audioBlob: Blob, transcript: string) => {
    setAudioBlob(audioBlob);
    setTranscript(transcript);
  };

  useEffect(() => {
    transcript && refetch();
  }, [transcript]);

  useEffect(() => {
    data && data.every(([_, isCorrect]) => !!isCorrect) && confetti.start();
  }, [data]);

  const shouldStopRecording = (transcript: string) => {
    const transcriptWords = transcript.split(" ");
    if (transcriptWords.length === length) {
      return true;
    }
    return false;
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

      {userDetails?.type !== "teacher" ? (
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
      ) : (
        <></>
      )}
      {audioUrl && !audioBlob && (
        <audio controls>
          <source src={audioUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
      <div className={styles["words-container"]}>
        {isLoading && <CircularProgress />}
        {data &&
          data.map(([text, isCorrect], index) => (
            <div
              key={index}
              className={
                isCorrect ? styles["correct-word"] : styles["wrong-word"]
              }
            >
              {text}
            </div>
          ))}
      </div>
    </div>
  );
};

export default withFade(SelfTesting);
