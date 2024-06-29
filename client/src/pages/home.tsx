import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { useLocation, Navigate } from 'react-router-dom';

interface LocationState {
  user: LoginUser;
}

const HomePage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  if (!state || !state.user) {
    return <Navigate to="/" replace />;
  }

  const { user } = state;

  return (
    <Box sx={{ padding: 3, direction: 'rtl' }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>ברוך הבא, {user.firstName} {user.lastName}!</Typography>
        <Typography variant="body1">פרטי המשתמש שלך:</Typography>
        <Box component="ul" sx={{ listStyleType: 'none', padding: 0 }}>
          <li><Typography>תעודת זהות: {user.id}</Typography></li>
          <li><Typography>אימייל: {user.email}</Typography></li>
          <li><Typography>טלפון: {user.phoneNumber}</Typography></li>
          <li><Typography>כתובת: {user.address}</Typography></li>
          <li><Typography>תאריך לידה: {user.birthDay}</Typography></li>
          <li><Typography>סוג משתמש: {user.type === 'student' ? 'תלמיד' : 'מורה'}</Typography></li>
        </Box>
      </Paper>
    </Box>
  );
};

export default HomePage;