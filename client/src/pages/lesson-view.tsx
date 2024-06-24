import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { useLessonsById } from "../hooks/useLessonById";
import { useTorahSection } from "../hooks/useTorahSection";
import LessonContent from "../components/lessons/lesson-content/lesson-content";
import Loader from "../components/common/loader";
import { useMemo } from "react";

const LessonView = () => {
  const { id } = useParams<{ id: string }>();
  // const [lesso, setLesso] = useState<FormattedLesson>();
  const navigate = useNavigate();
  // useEffect(() => {
  //   setLesso(id === "1" ? lesson1 : lesson4);
  // }, []);

  const { data: lesson, isLoading, isError } = useLessonsById(id!);

  const {
    data: text,
    isLoading: isLoadingText,
    isError: asdwe,
  } = useTorahSection(
    lesson?.pentateuch || "",
    lesson?.startChapter || "",
    lesson?.startVerse || "",
    lesson?.endChapter || "",
    lesson?.endVers || ""
  );

  const convertedLesson = lesson
    ? {
        audio: lesson?.audio,
        text: text,
        highlightsTimestamps: lesson.highlightsTimestamps,
      }
    : undefined;

  const handleNavigate = () => {
    navigate("/student-self-testing", { state: { lesson: convertedLesson } });
  };

  const lessonForView = useMemo(
    () => ({ ...(lesson || {}), text: text || {} } as LessonForView),
    [lesson, text]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoadingText && isLoading ? (
        <LessonContent lesson={lessonForView} />
      ) : (
        <Loader />
      )}

      <Button variant="contained" color="primary" onClick={handleNavigate}>
        עבור לנסיון
      </Button>
    </div>
  );
};

export default LessonView;
