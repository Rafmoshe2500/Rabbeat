import { useState } from "react";
import LessonView from "./lesson-view";
import LessonsList from "../components/lessons/lessons-list/lessons-list";
import {
  lesson1Details,
  lesson2Details,
  lesson3Details,
  lesson4Details,
  lesson5Details,
} from "../mocks/fakeData";

type StudentPersonalAreaProps = {
  currLesson?: FormattedLesson | undefined;
};

const StudentPersonalArea = ({ currLesson }: StudentPersonalAreaProps) => {
  const [lessons, setLessons] = useState<Array<LessonDetails>>([
    lesson1Details,
    lesson2Details,
    lesson3Details,
    lesson4Details,
    lesson5Details,
  ]);
  return (
    <div>
      <div style={{ marginBottom: "8rem" }}>אזור אישי לתלמיד</div>

      {lessons ? <LessonsList lessons={lessons} /> : <p>אין לך שיעורים כרגע</p>}

      {/* <LessonView currLesson={currLesson} /> */}
    </div>
  );
};

export default StudentPersonalArea;
