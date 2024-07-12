import React, { useState, useRef, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface AudioRecorderProps {
  onRecordingComplete: (
    audioBlob: Blob,
    audioURL: string,
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
  const [timestamps, setTimestamps] = useState<number[]>([0.0]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState<
    string | undefined
  >(undefined);
  const [end, setEnd] = useState(false);

  const { transcript, resetTranscript } = useSpeechRecognition();

  const handleStartRecording = async () => {
    resetTranscript();
    setTimestamps([0.0]);
    SpeechRecognition.startListening({ continuous: true, language });
    setIsRecording(true);
    audioChunksRef.splice(0, audioChunksRef.length);
    shouldCalculateHighlights && setStartTime(Date.now());

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef, { type: "audio/wav" });
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioURL(audioURL);
      setEnd(true);
    };

    mediaRecorderRef.current.start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
    setCurrentTranscript(transcript);
    mediaRecorderRef.current?.stop();
  };

  useEffect(() => {
    if (end) {
      console.log(transcript);
      const audioBlob = new Blob(audioChunksRef, { type: "audio/wav" });
      onRecordingComplete(audioBlob, audioURL!, transcript, timestamps);
      setEnd(false);
    }
  }, [end]);

  useEffect(() => {
    if (shouldStopRecording?.(transcript)) {
      setCurrentTranscript(transcript);
      handleStopRecording();
      return;
    }
    if (!shouldCalculateHighlights) {
      setCurrentTranscript(transcript);
      return;
    }
    if (!startTime) return;

    const transLength = transcript ? transcript.split(" ").length : 0;
    const currTransLength = currentTranscript
      ? currentTranscript?.split(" ").length
      : 0;

    if (transLength > currTransLength) {
      setTimestamps((prevTimestamps) => [
        ...prevTimestamps,
        (Date.now() - startTime - 300) / 1000,
      ]);
    } else if (transLength < currTransLength) {
      setTimestamps((prevTimestamps) => prevTimestamps.slice(0, -1));
    }

    setCurrentTranscript(transcript);
  }, [transcript, startTime]);

  return (
    <div>
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioURL && (
        <div>
          <audio controls src={audioURL}></audio>
        </div>
      )}
      {shouldDisplayTranscript && (
        <div>
          <h3>Transcript</h3>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
