import { useUser } from "../contexts/user-context";
import Loader from "../components/common/loader";
import DisplayCards from "../components/common/display-cards/display-cards";
import { useMediaQuery } from "@mui/material";
import LessonCard from "../components/lessons/lesson-card/lesson-card";
import { useLocation } from "react-router-dom";
import { useStudentLessonsByTeacher } from "../hooks/lessons/useStudentLessonsByTeacher";
import withFade from "../hoc/withFade.hoc";

const MyStudentLessons = () => {
  const location = useLocation();
  const studentId: string = location.state?.id;

  const { userDetails } = useUser();
  const { data: lessons, isLoading } = useStudentLessonsByTeacher(
    userDetails!.id,
    studentId
  );
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const viewMode = isSmallScreen ? "list" : "grid";

  const renderStudentCard = (lesson: LessonDetails) => (
    <LessonCard lessonDetails={lesson} studentId={studentId} />
  );

  return (
    <div>
      <div style={{ marginBottom: "8rem" }}>תלמיד חגם </div>

      {lessons ? (
        <DisplayCards
          items={lessons}
          renderCard={renderStudentCard}
          viewMode={viewMode}
          xs={12}
          sm={6}
          md={3}
        />
      ) : (
        <p>
          {isLoading ? (
            <Loader message="טוען שיעורים" />
          ) : (
            "אין לך שיעורים כרגע"
          )}
        </p>
      )}
    </div>
  );
};

export default withFade(MyStudentLessons);
