import React, { useState, useMemo } from "react";
import { Typography, Box, useMediaQuery, Button, Stack, TextField } from "@mui/material";
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
  const [searchQuery, setSearchQuery] = useState("");

  const students = useMemo(() => {
    let filteredStudents = fetchedStudents;
    
    if (showOnlyActive) {
      filteredStudents = filteredStudents.filter(student => 
        new Date(student.expired_date) > new Date()
      );
    }
    
    if (searchQuery) {
      filteredStudents = filteredStudents.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filteredStudents.sort((a, b) => {
      const dateA = new Date(a.expired_date).getTime();
      const dateB = new Date(b.expired_date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [fetchedStudents, showOnlyActive, sortOrder, searchQuery]);

  const onUpdateExpiredDate = async (studentId: string, newExpiredDate: string) => {
    await associateStudentMutation.mutateAsync({
      teacherId: userDetails!.id,
      studentId,
      expired_date: newExpiredDate,
    });
    refetch();
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

  return (
    <Box sx={{ flexGrow: 1, p: 4, direction: "rtl" }}>
      <Stack direction="column" spacing={2} mb={2} alignItems="center">
        <Box 
          display="flex"
          justifyContent="center"
          sx={{ gap: 2 }}  // This adds space between buttons
        >
          <Button 
            variant="contained"
            color={showOnlyActive ? "primary" : "secondary"}
            onClick={() => setShowOnlyActive(!showOnlyActive)}
            size="small"
            sx={{ minWidth: '120px' }}
          >
            {showOnlyActive ? "הצג את כולם" : "הצג פעילים"}
          </Button>
          <Button 
            variant="contained"
            color={sortOrder === 'desc' ? "primary" : "secondary"}
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            size="small"
            sx={{ minWidth: '120px' }}
          >
            {sortOrder === 'desc' ? "מיון יורד" : "מיון עולה"}
          </Button>
        </Box>
        <TextField
          variant="outlined"
          label="חיפוש תלמיד לפי שם מלא"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ maxWidth: '400px', width: '100%' }}
        />
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