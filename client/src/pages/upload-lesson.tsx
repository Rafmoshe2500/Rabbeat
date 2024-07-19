import { useState } from "react";
import { convertBlobToBase64 } from "../utils/audio-parser";
import BibleSelector from "../components/bible-selector/bible-selector";
import { useCreateOrUpdateLesson } from "../hooks/useCreateOrUpdateLesson";
import AudioRecorder from "../components/audio-recorder/audio-recorder";
import { useUser } from "../contexts/user-context";

const UploadLessonPage = () => {
  const {userDetails} = useUser();
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [timestamps, setTimestamps] = useState<number[]>([0.0]);

  const { mutate } = useCreateOrUpdateLesson(userDetails?.id!);

  const [lesson, setLesson] = useState({
    title: "",
    version: "Spanish",
    creationDate: "",
    audio: "",
    highlightsTimestamps: [],
  });

  const [torahSection, setTorahSection] = useState({
    startChapter: "",
    startVerse: "",
    endChapter: "",
    endVerse: "",
    pentateuch: "",
  });

  const handleRecordingComplete = (
    audioBlob: Blob,
    audioURL: string,
    transcript: string,
    timestamps: number[]
  ) => {
    setAudioBlob(audioBlob);
    setAudioURL(audioURL);
    setTranscript(transcript);
    setTimestamps(timestamps);
  };

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
    console.log({audioBlob});
    
    const lessonToUpload = {
      ...lesson,
      ...torahSection,
      creationDate: new Date().toISOString(),
      audio: await convertBlobToBase64(audioBlob!),
      highlightsTimestamps: timestamps,
      sttText: transcript,
    } as FormattedLesson;
    console.log(lessonToUpload.audio);
    mutate(lessonToUpload);
  };

  const isFormComplete = (): boolean => {
    return (
      !!lesson.title &&
      !!torahSection.endVerse &&
      !!lesson.version &&
      audioURL !== null &&
      timestamps.length > 1
    );
  };

  return (
    <div>
      <div>העלאת שיעורים</div>
      <BibleSelector setTorahSection={setTorahSection} />
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
      <AudioRecorder
        onRecordingComplete={handleRecordingComplete}
        shouldCalculateHighlights
        shouldDisplayTranscript
      />
    </div>
  );
};

export default UploadLessonPage;
