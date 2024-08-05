import { useLessonsDetailsByUser } from "../hooks/lessons/useLessonsDetailsByUser";
import { useUser } from "../contexts/user-context";
import DisplayCards from "../components/common/display-cards/display-cards";
import { useMediaQuery } from "@mui/material";
import LessonCard from "../components/lessons/lesson-card/lesson-card";
import withFade from "../hoc/withFade.hoc";
import { useNavigate } from 'react-router-dom';

const StudentPersonalArea = () => {
  const { userDetails } = useUser();
  const { data: lessons, isLoading } = useLessonsDetailsByUser(userDetails!.id);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const viewMode = isSmallScreen ? "list" : "grid";
  const navigate = useNavigate();

  const renderLessonCard = (lesson: LessonDetails) => (
    <LessonCard
      lessonDetails={lesson}
      onClick={() => navigate(`/lesson/${lesson.id}`, { state: { lessonDetails: lesson, allLessons: lessons } })}
    />
  );

  return (
    <div>
      <div style={{ marginBottom: "8rem" }}>השיעורים שלי</div>
      <DisplayCards
        items={lessons || []}
        renderCard={renderLessonCard}
        viewMode={viewMode}
        isLoading={isLoading}
        noItemsMessage={"אין לך שיעורים כרגע"}
        xs={12}
        sm={6}
        md={3}
      />
    </div>
  );
};

export default withFade(StudentPersonalArea);
