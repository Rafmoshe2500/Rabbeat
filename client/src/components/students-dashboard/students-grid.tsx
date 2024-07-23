import React from "react";
import { Typography, Box, useMediaQuery } from "@mui/material";
import StudentCard from "./student-card";
import DisplayCards from "../common/display-cards/display-cards";
import { useUser } from "../../contexts/user-context";
import { useGetStudents } from "../../hooks/useStudents";

const StudentGrid: React.FC = () => {
  const { userDetails } = useUser();
  const {
    data: students = [],
    isLoading,
    error,
  } = useGetStudents(userDetails!.id);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const viewMode = isSmallScreen ? "list" : "grid";

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error)
    return (
      <Typography>An error occurred: {(error as Error).message}</Typography>
    );

  const renderStudentCard = (student: Student) => (
    <StudentCard student={student} viewMode={viewMode} />
  );

  return (
    <Box sx={{ flexGrow: 1, p: 4, direction: "rtl" }}>
      <DisplayCards
        items={students}
        renderCard={renderStudentCard}
        viewMode={viewMode}
        xs={12}
        sm={6}
        md={3}
      />
    </Box>
  );
};

export default StudentGrid;
