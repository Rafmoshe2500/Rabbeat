import { useLessonsDetailsByUser } from "../hooks/lessons/useLessonsDetailsByUser";
import { useUser } from "../contexts/user-context";
import Loader from "../components/common/loader";
import DisplayCards from "../components/common/display-cards/display-cards";
import { useMediaQuery } from "@mui/material";
import LessonCard from "../components/lessons/lesson-card/lesson-card";

const StudentPersonalArea = () => {
  const { userDetails } = useUser();
  const {
    data: lessons,
    isLoading,
    isError,
  } = useLessonsDetailsByUser(userDetails!.id);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const viewMode = isSmallScreen ? "list" : "grid";

  const renderStudentCard = (lesson: LessonDetails) => (
    <LessonCard lessonDetails={lesson} />
  );

  return (
    <div>
      <div style={{ marginBottom: "8rem" }}>אזור אישי לתלמיד</div>

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
        // <LessonsList lessons={lessons} />
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

export default StudentPersonalArea;
