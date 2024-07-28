import React, { useState, useMemo } from "react";
import { Typography, Box, useMediaQuery, Button, Stack } from "@mui/material";
import StudentCard from "./student-card";
import DisplayCards from "../common/display-cards/display-cards";
import { useUser } from "../../contexts/user-context";
import { useGetStudents } from "../../hooks/useStudents";
import Loader from '../common/loader'

const StudentGrid: React.FC = () => {
  const { userDetails } = useUser();
  const {
    data: fetchedStudents = [],
    isLoading,
    error,
  } = useGetStudents(userDetails!.id);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const viewMode = isSmallScreen ? "list" : "grid";

  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const students = useMemo(() => {
    let filteredStudents = fetchedStudents;
    
    if (showOnlyActive) {
      filteredStudents = filteredStudents.filter(student => 
        new Date(student.expired_date) > new Date()
      );
    }
    
    return filteredStudents.sort((a, b) => {
      const dateA = new Date(a.expired_date).getTime();
      const dateB = new Date(b.expired_date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [fetchedStudents, showOnlyActive, sortOrder]);

  if (isLoading) return <Typography><Loader message="טוען תלמידים..."/></Typography>;
  if (error)
    return (
      <Typography>An error occurred: {(error as Error).message}</Typography>
    );

  const renderStudentCard = (student: Student) => (
    <StudentCard student={student} viewMode={viewMode} />
  );

  const toggleFilter = () => {
    setShowOnlyActive(!showOnlyActive);
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4, direction: "rtl" }}>

<Stack direction={isSmallScreen ? "column" : "row"}>
  <Button 
    sx={{ margin: '8px' }}
    variant="contained"
    color={showOnlyActive ? "primary" : "secondary"}
    onClick={toggleFilter}
    fullWidth={isSmallScreen}
  >
    {showOnlyActive ? "הצג את כל התלמידים" : "הצג רק תלמידים פעילים"}
  </Button>
  
  <Button 
    sx={{ margin:'8px' }}
    variant="contained"
    color={sortOrder === 'desc' ? "primary" : "secondary"}
    onClick={toggleSortOrder}
    fullWidth={isSmallScreen}
  >
    {sortOrder === 'desc' ? "מיין לפי סוף" : "מיין לפי התחלה"}
  </Button>
</Stack>


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