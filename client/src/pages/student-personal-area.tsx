import LessonsList from "../components/lessons/lessons-list/lessons-list";
import { useLessonsDetailsByUser } from "../hooks/useLessonsDetailsByUser";
import { useUser } from "../contexts/user-context";
import Loader from "../components/common/loader";

const StudentPersonalArea = () => {
  const { userDetails } = useUser();
  const {
    data: lessons,
    isLoading,
    isError,
  } = useLessonsDetailsByUser(userDetails!.id);

  return (
    <div>
      <div style={{ marginBottom: "8rem" }}>אזור אישי לתלמיד</div>

      {lessons ? (
        <LessonsList lessons={lessons} />
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

export default StudentPersonalArea;
