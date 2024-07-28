import { useLessonsDetailsByUser } from "../hooks/lessons/useLessonsDetailsByUser";
import { useUser } from "../contexts/user-context";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/loader";
import DisplayCards from "../components/common/display-cards/display-cards";
import { useMediaQuery } from "@mui/material";
import LessonCard from "../components/lessons/lesson-card/lesson-card";
import withFade from "../hoc/withFade.hoc";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FloatingActionButton from '../components/common/floating-action-button';

const TeacherPersonalArea = () => {
  const { userDetails } = useUser();
  const navigate = useNavigate();
  const { data: lessons, isLoading } = useLessonsDetailsByUser(userDetails!.id);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const viewMode = isSmallScreen ? "list" : "grid";

  const handleNavigate = () => {
    navigate("/upload-lesson");
  };


  const renderStudentCard = (lesson: LessonDetails) => (
    <LessonCard lessonDetails={lesson} />
  );

  return (
    <div>
      <div style={{ marginBottom: "8rem" }}>אזור אישי למרצה</div>

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
        <FloatingActionButton 
        onClick={handleNavigate} 
        icon={<UploadFileIcon />}
        ariaLabel="add lesson"
      />
    </div>
    
  );
};

export default withFade(TeacherPersonalArea);
