import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { getWrongWords } from "../utils/utils";
import DisplayText from "../components/display-lesson-text/display-lesson-text";
import { useFlattedLessonText } from "../hooks/useFlattedLessonText";

const SelfTesting = () => {
  const location = useLocation();
  const lesson: Lesson = location.state?.lesson;
  const {
    transcript,
    isMicrophoneAvailable,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentTranscript, setCurrentTranscript] = useState<string>("");
  const { flattedText, length } = useFlattedLessonText(lesson?.text);

  useEffect(() => {
    setCurrentTranscript(transcript);
  }, [transcript]);

  useEffect(() => {
    const transcriptWords = currentTranscript.split(" ");
    if (transcriptWords.length === length) {
      SpeechRecognition.stopListening();
      setIsSpeaking(false);
    }
  }, [currentTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition.</div>;
  }

  if (!isMicrophoneAvailable) {
    return <div>Microphone is not connected.</div>;
  }

  const handleOnRecord = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsSpeaking(false);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: "iw-IL" });
      setIsSpeaking(true);
    }
  };

  return (
    <div>
      כאן בודקים
      <div>{lesson && <DisplayText text={lesson.text!} />}</div>
      <div>
        <button onClick={resetTranscript}>Reset</button>
        <button onClick={handleOnRecord}>
          {isSpeaking ? "Stop" : "Record"}
        </button>
      </div>
      <div>
        <p>Spoken Text: {currentTranscript}</p>
      </div>
      <div
        style={{
          direction: "rtl",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {currentTranscript &&
          getWrongWords(currentTranscript, flattedText).map((word, index) => (
            <div
              key={index}
              style={{
                paddingLeft: "3px",
                color: !word.isCorrect ? "red" : "green",
              }}
              className={!word.isCorrect ? "redText" : "greenText"}
            >
              {word.text}
            </div>
          ))}
      </div>
      <div>
        {currentTranscript &&
          (currentTranscript === flattedText ? "הצלחת" : "נסה שוב")}
      </div>
    </div>
  );
};

export default SelfTesting;
