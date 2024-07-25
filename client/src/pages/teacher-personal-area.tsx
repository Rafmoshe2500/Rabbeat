import Button from "@mui/material/Button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LessonsList from "../components/lessons/lessons-list/lessons-list";

const TeacherPersonalArea: React.FC = () => {
  const navigate = useNavigate();
  const [lessons] = useState<Array<LessonDetails>>([
    // { name: "בראשית - ראשון", id: "123", status: "finished" },
    // { name: "בראשית - שני", id: "132", status: "not-started" },
    // { name: "בראשית - שלישי", id: "142", status: "in-progress" },
  ]);

  // fetch request for all lessons names, onClick move to lesson editor

  const handleNavigate = () => {
    navigate("/upload-lesson");
  };

  return (
    <div>
      {lessons ? <LessonsList lessons={lessons} /> : <p>אין לך שיעורים כרגע</p>}

      <Button variant="contained" color="primary" onClick={handleNavigate}>
        +
      </Button>
    </div>
  );
};

export default TeacherPersonalArea;
