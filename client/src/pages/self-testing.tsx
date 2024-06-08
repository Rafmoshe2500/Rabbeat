import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { getWrongWords } from "../utils/utils";

type SelfTestingProps = {
  lesson?: {
    audio: Blob;
    text: string;
  };
};

const SelfTesting = () => {
  const location = useLocation();
  const lesson = location.state?.lesson as SelfTestingProps["lesson"];
  const {
    transcript,
    isMicrophoneAvailable,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentTranscript, setCurrentTranscript] = useState<string>("");

  useEffect(() => {
    setCurrentTranscript(transcript);
  }, [transcript]);

  useEffect(() => {
    if (currentTranscript.length === lesson?.text.length) {
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
      <div>
        <div>הטקסט הרצוי הינו: {lesson?.text}</div>
      </div>
      <div>
        <button onClick={resetTranscript}>Reset</button>
        <button onClick={handleOnRecord}>
          {isSpeaking ? "Stop" : "Record"}
        </button>
      </div>
      <div>
        <p>Spoken Text: {currentTranscript}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {currentTranscript &&
          getWrongWords(currentTranscript, lesson?.text ?? "").map(
            (word, index) => (
              <div
                key={index}
                style={{ paddingLeft: "3px" }}
                className={!word.isCorrect ? "redText" : "greenText"}
              >
                {word.text}
              </div>
            )
          )}
      </div>
      <div>
        {currentTranscript &&
          (currentTranscript === lesson?.text ? "הצלחת" : "נסה שוב")}
      </div>
    </div>
  );
};

export default SelfTesting;
