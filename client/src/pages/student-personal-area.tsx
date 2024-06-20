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
import { useLessonsByUser } from "../hooks/useLessonsByUser";
import { useUser } from "../contexts/user-context";

const StudentPersonalArea = () => {
  const { userDetails } = useUser();
  const {
    data: lessons1,
    isLoading,
    isError,
  } = useLessonsByUser(userDetails!.id);

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

      {lessons1 ? (
        <LessonsList lessons={lessons1} />
      ) : (
        <p>אין לך שיעורים כרגע</p>
      )}

      {/* <LessonView currLesson={currLesson} /> */}
    </div>
  );
};

export default StudentPersonalArea;