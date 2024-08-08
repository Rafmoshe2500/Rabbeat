import React, { useState } from "react";
import StudentGrid from "../components/students-dashboard/students-grid";
import AddStudentDialog from "../components/students/add-student-dialog";
import withFade from "../hoc/withFade.hoc";
import FloatingActionButton from '../components/common/floating-action-button';
import AddIcon from '@mui/icons-material/Add';
import { Typography } from "@mui/material";

const TeacherStudents: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <Typography variant="h1" gutterBottom>התלמידים שלי</Typography>
      <StudentGrid />
      <FloatingActionButton
        icon={<AddIcon />}
        onClick={() => setIsDialogOpen(true)} />
      <AddStudentDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default withFade(TeacherStudents);