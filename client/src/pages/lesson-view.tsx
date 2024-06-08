import { useNavigate, useParams } from "react-router-dom";
import TranslatorLibrary from "../components/lesson-test";
import { convertBase64ToBlob } from "../utils/audio-parser";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { lesson1, lesson2, lesson3 } from "../mocks/fakeData";

type LessonViewProps = {
  currLesson?: FormattedLesson | undefined;
};

const LessonView = ({ currLesson }: LessonViewProps) => {
  const { id } = useParams<{ id: string }>();
  const [lesso, setLesso] = useState<FormattedLesson>();
  const navigate = useNavigate();
  useEffect(() => {
    setLesso(id === "1" ? lesson1 : lesson3);
  }, []);

  const lesson = lesso
    ? {
        audio: convertBase64ToBlob(lesso.audioInBase64),
        text: lesso.text,
        highlightsTimestamps: lesso.highlightsTimestamps,
      }
    : undefined;

  const handleNavigate = () => {
    navigate("/student-self-testing", { state: { lesson } });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TranslatorLibrary lesson={lesson} />
      <Button variant="contained" color="primary" onClick={handleNavigate}>
        עבור לנסיון
      </Button>
    </div>
  );
};

export default LessonView;
