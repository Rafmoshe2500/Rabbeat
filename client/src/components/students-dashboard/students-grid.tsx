import React, { useState, useMemo } from "react";
import { Typography, Box, useMediaQuery, Button, Stack } from "@mui/material";
import StudentCard from "./student-card";
import DisplayCards from "../common/display-cards/display-cards";
import { useUser } from "../../contexts/user-context";
import { useGetStudents, useAssociateStudentToTeacher } from "../../hooks/useStudents";
import Loader from '../common/loader'

const StudentGrid: React.FC = () => {
  const { userDetails } = useUser();
  const {
    data: fetchedStudents = [],
    isLoading,
    error,
    refetch,
  } = useGetStudents(userDetails!.id);
  const associateStudentMutation = useAssociateStudentToTeacher();
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const viewMode = isSmallScreen ? "list" : "grid";

  const [showOnlyActive, setShowOnlyActive] = useState(true);
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

  const onUpdateExpiredDate = async (studentId: string, newExpiredDate: string) => {
    try {
      await associateStudentMutation.mutateAsync({
        teacherId: userDetails!.id,
        studentId,
        expired_date: newExpiredDate,
      });
      refetch(); // Refetch the students data after updating
    } catch (error) {
      console.error("Failed to update expired date:", error);
      // You might want to show an error message to the user here
    }
  };

  if (isLoading) return <Typography><Loader message="טוען תלמידים..."/></Typography>;
  if (error)
    return (
      <Typography>An error occurred: {(error as Error).message}</Typography>
    );

  const renderStudentCard = (student: Student) => (
    <StudentCard 
      student={student} 
      viewMode={viewMode} 
      onUpdateExpiredDate={onUpdateExpiredDate}
    />
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
          הצג את כולם
        </Button>
        
        <Button 
          sx={{ margin:'8px' }}
          variant="contained"
          color={sortOrder === 'desc' ? "primary" : "secondary"}
          onClick={toggleSortOrder}
          fullWidth={isSmallScreen}
        >
          הצג מהסוף
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