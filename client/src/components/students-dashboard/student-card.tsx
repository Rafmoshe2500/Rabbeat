import React from 'react';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

type StyledPaperProps = {
  $viewMode: 'grid' | 'list';
};

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== '$viewMode',
})<StyledPaperProps>(({ $viewMode }) => ({
  padding: '16px',
  textAlign: $viewMode === 'grid' ? 'center' : 'left',
  color: '#666666',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: $viewMode === 'grid' ? 'center' : 'flex-start',
  alignItems: $viewMode === 'grid' ? 'center' : 'flex-start',
  borderRadius: $viewMode === 'grid' ? 16 : 0,
  transition: 'all 0.3s',
  '&:hover': {
    transform: $viewMode === 'grid' ? 'scale(1.05)' : 'none',
    boxShadow: $viewMode === 'grid' ? '0px 6px 12px rgba(0, 0, 0, 0.15)' : 'none',
  },
}));

interface StudentCardProps {
  student: Student;
  viewMode: 'grid' | 'list';
}

const StudentCard: React.FC<StudentCardProps> = ({ student, viewMode }) => (
  <StyledPaper elevation={viewMode === 'grid' ? 3 : 0} $viewMode={viewMode}>
    <Typography variant={viewMode === 'grid' ? 'h6' : 'body1'} gutterBottom>
      {`${student.firstName} ${student.lastName}`}
    </Typography>
    <Typography variant={viewMode === 'grid' ? 'body1' : 'body2'}>
      {student.phoneNumber}
    </Typography>
  </StyledPaper>
);

export default StudentCard;