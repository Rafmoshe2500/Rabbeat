import { useNavigate } from "react-router-dom";
import "./lesson-card.css";
import { useUser } from "../../../contexts/user-context";

const LessonCard = ({ id, name, status }: LessonDetails) => {
  const navigate = useNavigate();
  const { userDetails } = useUser();

  const onClick = () => {
    const route =
      userDetails?.type === "student" ? `/lesson/${id}` : "/upload-lesson";

    navigate(route, { state: { id } });
  };

  return (
    <div onClick={onClick} className="card">
      <p className={`container ${status}`}>{name}</p>
    </div>
  );
};

export default LessonCard;
