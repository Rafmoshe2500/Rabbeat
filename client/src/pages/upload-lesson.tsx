import { useState, useRef, useEffect } from "react";
import { convertBlobToBase64 } from "../utils/audio-parser";
import BibleSelector from "../components/bible-selector/bible-selector";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useCreateOrUpdateLesson } from "../hooks/useCreateOrUpdateLesson";

const UploadLessonPage = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [timestamps, setTimestamps] = useState<number[]>([0.0]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currTime, setCurrTime] = useState<number | null>(null);

  const {
    transcript,
    isMicrophoneAvailable,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const { mutate } = useCreateOrUpdateLesson();

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
      // You can handle the audio upload here if needed
    }
  };

  useEffect(() => {
    if (!startTime) return;

    const transLength = transcript ? transcript.split(" ").length : 0;
    const currTransLength = currentTranscript
      ? currentTranscript?.split(" ").length
      : 0;
    console.log({ transcript });
    console.log({ transLength });

    if (transLength > currTransLength) {
      console.log("should addddddddddddd");
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

  const [lesson, setLesson] = useState<FormattedLesson>({
    title: "",
    startChapter: "",
    startVerse: "",
    endChapter: "",
    endVers: "",
    pentateuch: "",
    version: "Spanish",
    creationDate: "",
    audio: "",
    highlightsTimestamps: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLesson((prevLesson) => ({
      ...prevLesson,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      ...lesson,
      creationDate: new Date().toISOString(),
      audio: await convertBlobToBase64(audioBlob!),
      highlightsTimestamps: timestamps,
    });
  };

  const isFormComplete = (): boolean => {
    return (
      !!lesson.title &&
      !!lesson.startChapter &&
      !!lesson.startVerse &&
      !!lesson.endChapter &&
      !!lesson.endVers &&
      !!lesson.pentateuch &&
      !!lesson.version &&
      audioURL !== null &&
      timestamps.length > 1 // Ensure there is at least one highlight besides the initial 0.0
    );
  };

  return (
    <div>
      <div>העלאת שיעורים</div>

      <BibleSelector />

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={lesson.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Start Chapter:</label>
          <input
            type="text"
            name="startChapter"
            value={lesson.startChapter}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Start Verse:</label>
          <input
            type="text"
            name="startVerse"
            value={lesson.startVerse}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>End Chapter:</label>
          <input
            type="text"
            name="endChapter"
            value={lesson.endChapter}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>End Verse:</label>
          <input
            type="text"
            name="endVers"
            value={lesson.endVers}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Pentateuch:</label>
          <input
            type="text"
            name="pentateuch"
            value={lesson.pentateuch}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Version:</label>
          <select
            name="version"
            value={lesson.version}
            onChange={handleChange}
            required
          >
            <option value="Ashkenaz">אשכנזי</option>
            <option value="Spanish">ספרדי</option>
          </select>
        </div>
        <button type="submit" disabled={!isFormComplete()}>
          Submit
        </button>
      </form>

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
        <p>{transcript}</p>
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
