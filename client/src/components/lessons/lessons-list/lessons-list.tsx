import LessonCard from "../lesson-card/lesson-card";
import "./lesson-list.css";

type LessonListProps = {
  lessons: Array<LessonDetails>;
};

const LessonsList = ({ lessons }: LessonListProps) => {
  return (
    <div className="lessons-container">
      {lessons.map((item) => (
        <LessonCard
          key={item.id}
          id={item.id}
          name={item.name}
          status={item.status}
        />
      ))}
    </div>
  );
};

export default LessonsList;
