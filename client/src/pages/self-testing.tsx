import { useEffect, useState } from "react";
import DisplayText from "../components/display-lesson-text/display-lesson-text";
import { useFlattedLessonText } from "../hooks/useFlattedLessonText";
import { useCompareTexts } from "../hooks/useCompareTexts";
import { Button, CircularProgress } from "@mui/material";
import AudioRecorder from "../components/audio-recorder/audio-recorder";
import { useUpdateTestAudio } from "../hooks/useUpdateTestAudio";
import { convertBlobToBase64 } from "../utils/audio-parser";

type SelfTestingProps = {
  lesson?: Lesson;
};

const SelfTesting = ({ lesson }: SelfTestingProps) => {
  const { flattedText, length } = useFlattedLessonText(lesson?.text);
  const { mutate } = useUpdateTestAudio(lesson?.testAudioId!);

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");

  const { data, isLoading, refetch } = useCompareTexts(flattedText, transcript);

  const handleRecordingComplete = (
    audioBlob: Blob,
    audioURL: string,
    transcript: string
  ) => {
    setAudioBlob(audioBlob);
    setAudioURL(audioURL);
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
    mutate(convertedAudio);
  };

  return (
    <div>
      <div>{lesson && <DisplayText text={lesson.text!} />}</div>

      <div
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row-reverse",
        }}
      >
        <AudioRecorder
          onRecordingComplete={handleRecordingComplete}
          shouldStopRecording={shouldStopRecording}
          shouldDisplayTranscript
        />

        {audioBlob && (
          <Button variant="contained" color="primary" onClick={uploadRecord}>
            שמור
          </Button>
        )}
      </div>
      <div
        style={{
          direction: "rtl",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
          gap: "10px 0",
        }}
      >
        {isLoading && <CircularProgress />}
        {data &&
          data.map(([text, isCorrect], index) => (
            <div
              key={index}
              style={{
                paddingLeft: "3px",
                color: !isCorrect ? "red" : "green",
              }}
              className={!isCorrect ? "redText" : "greenText"}
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
