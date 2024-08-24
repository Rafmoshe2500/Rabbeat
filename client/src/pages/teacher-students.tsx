import React, { useState } from "react";
import StudentGrid from "../components/students-dashboard/students-grid";
import AddStudentDialog from "../components/students/add-student-dialog";
import withFade from "../hoc/withFade.hoc";
import FloatingActionButton from "../components/common/floating-action-button";
import AddIcon from "@mui/icons-material/Add";
import { Typography } from "@mui/material";
import useToaster from "../hooks/useToaster";
import Toaster from "../components/common/toaster";

const TeacherStudents: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toaster, setToaster, handleCloseToaster } = useToaster();

  const handleCloseAddStudentDialog = (studentAdded: boolean) => {
    setIsDialogOpen(false);
    studentAdded &&
      setToaster({
        open: true,
        message: "התלמיד נוסף בהצלחה.",
        color: "success",
      });
  };

  return (
    <div>
      <Typography variant="h1" gutterBottom>
        התלמידים שלי
      </Typography>
      <StudentGrid />
      <FloatingActionButton
        icon={<AddIcon />}
        onClick={() => setIsDialogOpen(true)}
      />
      <AddStudentDialog
        open={isDialogOpen}
        onClose={handleCloseAddStudentDialog}
      />
      <Toaster
        message={toaster.message}
        open={toaster.open}
        color={toaster.color}
        onClose={handleCloseToaster}
      />
    </div>
  );
};

export default withFade(TeacherStudents);
