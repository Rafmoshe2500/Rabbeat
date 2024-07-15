import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import DisplayText from "../components/display-lesson-text/display-lesson-text";
import { useFlattedLessonText } from "../hooks/useFlattedLessonText";
import { useCompareTexts } from "../hooks/useCompareTexts";
import { Box, Button, CircularProgress } from "@mui/material";
import AudioRecorder from "../components/audio-recorder/audio-recorder";
import Chat from "../components/chat/chat";

type SelfTestingProps = {
  lesson?: Lesson;
};

const SelfTesting = ({ lesson }: SelfTestingProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleToggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const { flattedText, length } = useFlattedLessonText(lesson?.text);

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

  return (
    <div>
      <AudioRecorder
        onRecordingComplete={handleRecordingComplete}
        shouldStopRecording={shouldStopRecording}
        shouldDisplayTranscript
      />
      <div>{lesson && <DisplayText text={lesson.text!} />}</div>
      <div
        style={{
          direction: "rtl",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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

      <Box>
        <Button variant="contained" color="primary" onClick={handleToggleChat}>
          {isChatOpen ? "Close Chat" : "Open Chat"}
        </Button>
        {isChatOpen && (
          <Chat
            isOpen={isChatOpen}
            setIsOpen={setIsChatOpen}
            lessonId={lesson?.id!}
          />
        )}
      </Box>
    </div>
  );
};

export default SelfTesting;
