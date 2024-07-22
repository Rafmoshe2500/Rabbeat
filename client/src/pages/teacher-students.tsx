import React from 'react';
import StudentGrid from '../components/students-dashboard/students-grid';

const TeacherStudents: React.FC = () => {
  return (
    <div>
      <h1>התלמידים שלי</h1>
      <StudentGrid />
    </div>
  );
};

export default TeacherStudents;