import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { useUser } from "../contexts/user-context";


const Home: React.FC = () => {
  const { userDetails } = useUser();


  return (
    <Box sx={{ padding: 3, direction: 'rtl' }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>ברוך הבא, {userDetails?.firstName} {userDetails?.lastName}!</Typography>
        <Typography variant="body1">פרטי המשתמש שלך:</Typography>
        <Box component="ul" sx={{ listStyleType: 'none', padding: 0 }}>
          <li><Typography>תעודת זהות: {userDetails?.id}</Typography></li>
          <li><Typography>אימייל: {userDetails?.email}</Typography></li>
          <li><Typography>טלפון: {userDetails?.phoneNumber}</Typography></li>
          <li><Typography>כתובת: {userDetails?.address}</Typography></li>
          <li><Typography>תאריך לידה: {userDetails?.birthDay}</Typography></li>
          <li><Typography>סוג משתמש: {userDetails?.type === 'student' ? 'תלמיד' : 'מורה'}</Typography></li>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;