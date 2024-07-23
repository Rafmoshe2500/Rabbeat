import { useEffect, useState } from "react";
import DisplayText from "../display-lesson-text/display-lesson-text";
import { useFlattedLessonText } from "../../hooks/lessons/useFlattedLessonText";
import { useCompareTexts } from "../../hooks/useCompareTexts";
import { Button, CircularProgress } from "@mui/material";
import AudioRecorder from "../audio-recorder/audio-recorder";
import { useUpdateTestAudio } from "../../hooks/useUpdateTestAudio";
import { convertBlobToBase64 } from "../../utils/audio-parser";
import styles from "./self-testing.module.scss";
import { useTestAudio } from "../../hooks/useTestAudio";
import { useUser } from "../../contexts/user-context";

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

  useEffect(() => {
    if (testAudio) {
      const url = URL.createObjectURL(testAudio);
      setAudioUrl(url);

      return () => {
        URL.revokeObjectURL(url); // Cleanup the URL object when the component is unmounted
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

  const shouldStopRecording = (transcript: string) => {
    const transcriptWords = transcript.split(" ");
    if (transcriptWords.length === length) {
      return true;
    }
    return false;
  };

  const uploadRecord = async () => {
    const convertedAudio = await convertBlobToBase64(audioBlob!);
    updateTestAudioMutation.mutate(convertedAudio);
  };

  return (
    <div>
      <div>{lesson && <DisplayText text={lesson.text!} />}</div>

      {userDetails?.type !== "teacher" ? (
        <div className={styles["record-container"]}>
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            shouldStopRecording={shouldStopRecording}
            shouldDisplayTranscript
          />
          {audioBlob && (
            <Button
              variant="contained"
              color="primary"
              onClick={uploadRecord}
              disabled={updateTestAudioMutation.isPending}
            >
              {updateTestAudioMutation.isPending ? (
                <CircularProgress size={24} />
              ) : (
                "שמור נסיון חדש"
              )}
            </Button>
          )}
        </div>
      ) : (
        <></>
      )}
      {audioUrl && !audioBlob && (
        <div className={styles["last-chance"]}>
          הנסיון האחרון:
          <audio controls>
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
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

      <div>
        {data &&
          (data.every(([_, isCorrect]) => !!isCorrect) ? "הצלחת" : "נסה שוב")}
      </div>
    </div>
  );
};

export default SelfTesting;
