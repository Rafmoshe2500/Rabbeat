import React, { useState, useRef, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface AudioRecorderProps {
  onRecordingComplete: (
    audioBlob: Blob,
    transcript: string,
    timestamps: number[]
  ) => void;
  shouldStopRecording?: (transcript: string) => boolean;
  shouldDisplayTranscript?: boolean;
  shouldCalculateHighlights?: boolean;
  language?: string;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  shouldDisplayTranscript = false,
  shouldCalculateHighlights = false,
  shouldStopRecording = undefined,
  language = "iw-IL",
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef: Blob[] = [];
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState<string>("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [end, setEnd] = useState(false);

  const { transcript, interimTranscript, resetTranscript } =
    useSpeechRecognition();

  const handleStartRecording = async () => {
    resetTranscript();
    setTimestamps([0]);
    SpeechRecognition.startListening({ continuous: true, language });
    setIsRecording(true);
    audioChunksRef.splice(0, audioChunksRef.length);
    setStartTime(new Date().getTime());

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef, { type: "audio/wav" });
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioBlob(audioBlob);
      setAudioURL(audioURL);
      setEnd(true);
    };

    mediaRecorderRef.current.start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
    mediaRecorderRef.current?.stop();
  };

  useEffect(() => {
    if (end) {
      onRecordingComplete(audioBlob!, transcript, timestamps);
      setEnd(false);
    }
  }, [end]);

  useEffect(() => {
    if (shouldStopRecording?.(transcript)) {
      handleStopRecording();
      return;
    }
    if (!shouldCalculateHighlights || !startTime) return;

    const previousWords = currentTranscript.split(" ");
    const currentWords = interimTranscript.trim().split(" ");
    
    if (currentWords.length > previousWords.length) {
      const newWords = currentWords.slice(previousWords.length);

      // Add a timestamp for each new word
      const newTimestamps = newWords.map(() => 
        (new Date().getTime() - startTime!) / 1000
      );
      
      setTimestamps((prev) => [...prev, ...newTimestamps]);
    }

    setCurrentTranscript(interimTranscript);
  }, [interimTranscript, startTime]);

  return (
    <div>
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
      >
        {isRecording ? "עצור הקלטה" : "התחל להקליט"}
      </button>
      {audioURL && (
        <div>
          <audio controls src={audioURL}></audio>
        </div>
      )}
      {shouldDisplayTranscript && (
        <div>
          <p>{currentTranscript}</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
