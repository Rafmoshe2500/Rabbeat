import React, { useState } from 'react';
import StudentGrid from '../components/students-dashboard/students-grid';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import AddStudentDialog from '../components/students/add-student-dialog';

const TeacherStudents: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <h1>התלמידים שלי</h1>
      <StudentGrid />
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setIsDialogOpen(true)}
      >
        <AddIcon />
      </Fab>
      <AddStudentDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
};

export default TeacherStudents;