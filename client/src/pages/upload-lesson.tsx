import { useState, useRef, useEffect } from "react";
import { convertBlobToBase64 } from "../utils/audio-parser";
import BibleSelector from "../components/bible-selector/bible-selector";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

type UploadLessonProps = {
  setCurrLesson?: (lesson: FormattedLesson) => void;
};

const UploadLessonPage = ({ setCurrLesson }: UploadLessonProps) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);

  const {
    transcript,
    isMicrophoneAvailable,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleStartRecording = async () => {
    SpeechRecognition.startListening({ continuous: true, language: "iw-IL" });
    setIsRecording(true);
    audioChunksRef.current = [];
    setStartTime(Date.now());

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      setAudioBlob(audioBlob);
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioURL(audioURL);
    };

    mediaRecorderRef.current.start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
    mediaRecorderRef.current?.stop();
  };

  const handleUploadAudio = async () => {
    if (audioBlob) {
      const base64Audio = await convertBlobToBase64(audioBlob);
      console.log("Uploading audio:", base64Audio);
      console.log("HighlightTimes:", timestamps);

      setCurrLesson?.({
        audioInBase64: base64Audio,
        text: "ויצא יעקב מבאר שבע וילך חרנה",
      });
      // Here you would send `base64Audio` to your server
      // const response = await fetch('/upload-audio', {
      //     method: 'POST',
      //     headers: {
      //         'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({ audio: base64Audio })
      // });
      // if (response.ok) {
      //     console.log('Audio uploaded successfully');
      // } else {
      //     console.error('Failed to upload audio');
      // }
    }
  };

  useEffect(() => {
    if (!startTime) return;

    const transLength = transcript.split(" ").length;
    const currTransLength = currentTranscript?.split(" ").length || 0;

    console.log({ transLength });
    console.log({ currTransLength });

    if (transLength > currTransLength) {
      setTimestamps((prevTimestamps) => [
        ...prevTimestamps,
        (Date.now() - startTime) / 1000,
      ]);
    } else if (transLength < currTransLength) {
      setTimestamps((prevTimestamps) => prevTimestamps.slice(0, -1));
    }

    setCurrentTranscript(transcript);
  }, [transcript, startTime]);

  const [currentTranscript, setCurrentTranscript] = useState<
    string | undefined
  >(undefined);

  return (
    <div>
      <div>העלאת שיעורים</div>

      <BibleSelector />

      <div>
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
      {audioURL && (
        <div>
          <audio controls src={audioURL}></audio>
          <button onClick={handleUploadAudio}>Upload Audio</button>
        </div>
      )}
      <div>
        <h3>Transcript</h3>
        <p>{currentTranscript}</p>
      </div>
      <div>
        <h3>Timestamps</h3>
        <ul>
          {timestamps.map((timestamp, index) => (
            <li key={index}>{timestamp.toFixed(2)} seconds</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UploadLessonPage;

// import { useState, useRef, useEffect } from "react";
// import { convertBlobToBase64 } from "../utils/audio-parser";
// import BibleSelector from "../components/bible-selector/bible-selector";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

// type UploadLessonProps = {
//   setCurrLesson?: (lesson: FormattedLesson) => void;
// };

// const UploadLessonPage = ({ setCurrLesson }: UploadLessonProps) => {
//   const [isRecording, setIsRecording] = useState<boolean>(false);
//   const [audioURL, setAudioURL] = useState<string | null>(null);
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);
//   // stt section
//   const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
//   const [currentTranscript, setCurrentTranscript] = useState<string>("");
//   const [timestamps, setTimestamps] = useState();

//   const {
//     transcript,
//     isMicrophoneAvailable,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//   } = useSpeechRecognition();

//   const handleStartRecording = async () => {
//     handleOnRecord();
//     setIsRecording(true);
//     audioChunksRef.current = [];

//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaRecorderRef.current = new MediaRecorder(stream);

//     mediaRecorderRef.current.ondataavailable = (event) => {
//       audioChunksRef.current.push(event.data);
//     };

//     mediaRecorderRef.current.onstop = async () => {
//       const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
//       setAudioBlob(audioBlob);
//       const audioURL = URL.createObjectURL(audioBlob);
//       setAudioURL(audioURL);
//     };

//     mediaRecorderRef.current.start();
//   };

//   const handleStopRecording = () => {
//     setIsRecording(false);
//     mediaRecorderRef.current?.stop();
//   };

//   const handleUploadAudio = async () => {
//     if (audioBlob) {
//       const base64Audio = await convertBlobToBase64(audioBlob);
//       console.log("Uploading audio:", base64Audio);
//       setCurrLesson?.({
//         audioInBase64: base64Audio,
//         text: "ויצא יעקב מבאר שבע וילך חרנה",
//       });
//       // Here you would send `base64Audio` to your server

//       // const response = await fetch('/upload-audio', {
//       //     method: 'POST',
//       //     headers: {
//       //         'Content-Type': 'application/json'
//       //     },
//       //     body: JSON.stringify({ audio: base64Audio })
//       // });

//       // if (response.ok) {
//       //     console.log('Audio uploaded successfully');
//       // } else {
//       //     console.error('Failed to upload audio');
//       // }
//     }
//   };

//   // stt section

//   useEffect(() => {
//     const asd = mediaRecorderRef.current?.state;
//     setCurrentTranscript(transcript);
//   }, [transcript]);

//   if (!browserSupportsSpeechRecognition) {
//     return <div>Browser doesn't support speech recognition.</div>;
//   }

//   if (!isMicrophoneAvailable) {
//     return <div>Microphone is not connected.</div>;
//   }

//   const handleOnRecord = () => {
//     if (listening) {
//       SpeechRecognition.stopListening();
//       setIsSpeaking(false);
//     } else {
//       resetTranscript();
//       SpeechRecognition.startListening({ continuous: true, language: "iw-IL" });
//       setIsSpeaking(true);
//     }
//   };

//   return (
//     <div>
//       <div>העלאת שיעורים</div>

//       <BibleSelector />

//       <div>
//         <button
//           onClick={isRecording ? handleStopRecording : handleStartRecording}
//         >
//           {isRecording ? "Stop Recording" : "Start Recording"}
//         </button>
//       </div>
//       {audioURL && (
//         <div>
//           <audio controls src={audioURL}></audio>
//           <button onClick={handleUploadAudio}>Upload Audio</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadLessonPage;
