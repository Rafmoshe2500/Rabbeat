import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { useUser } from "../contexts/user-context";

const Home: React.FC = () => {
  const { userDetails } = useUser();

  console.log("Home component rendering. User details:", userDetails);

  if (!userDetails) {
    return <Typography>No user details available. Please log in.</Typography>;
  }

  return (
    <Box sx={{ padding: 3, direction: 'rtl' }}>
      <Paper elevation={3} sx={{ padding: 3 , direction: 'rtl'}}>
        <Typography sx={{ direction: 'rtl'}} variant="h4" gutterBottom>ברוך הבא, {userDetails.firstName} {userDetails.lastName}!</Typography>
        <Typography sx={{ direction: 'rtl'}} variant="body1">פרטי המשתמש שלך:</Typography>
        <Box component="ul" sx={{ listStyleType: 'none', padding: 0 , direction: 'rtl'}}>
          <li><Typography sx={{ direction: 'rtl'}}>תעודת זהות: {userDetails.id}</Typography></li>
          <li><Typography sx={{ direction: 'rtl'}}>אימייל: {userDetails.email}</Typography></li>
          <li><Typography sx={{ direction: 'rtl'}}>טלפון: {userDetails.phoneNumber}</Typography></li>
          <li><Typography sx={{ direction: 'rtl'}}>כתובת: {userDetails.address}</Typography></li>
          <li><Typography sx={{ direction: 'rtl'}}>תאריך לידה: {userDetails.birthDay}</Typography></li>
          <li><Typography sx={{ direction: 'rtl'}}>סוג משתמש: {userDetails.type === 'student' ? 'תלמיד' : 'מורה'}</Typography></li>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;