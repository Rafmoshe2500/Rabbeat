import LessonCard from "../lesson-card/lesson-card";
import "./lesson-list.css";

type LessonListProps = {
  lessons: Array<Partial<LessonDetails>>;
};

const LessonsList = ({ lessons }: LessonListProps) => {
  return (
    <div className="lessons-container">
      {lessons?.map((lesson) => (
        <LessonCard
          key={lesson.creationDate}
          lessonDetails={lesson}
          // key={lesson.id}
          // id={lesson.id}
          // title={lesson.title}
          // status={lesson.status}
        />
      ))}
    </div>
  );
};

export default LessonsList;
