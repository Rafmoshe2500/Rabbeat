// ProfileActions.tsx
import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { FaWhatsapp } from 'react-icons/fa';
import DialogComponent from '../common/dialog';

type ProfileActionsProps = {
  profile: teacherProfile;
};

const ProfileActions: React.FC<ProfileActionsProps> = ({ profile }) => {
  const [contactVisible, setContactVisible] = useState(false);

  const handleContactClick = () => {
    setContactVisible(true);
  };

  const closeContact = () => {
    setContactVisible(false);
  };

  return (
    <Box className="profile-actions" sx={{marginTop: '10px'}}>
      <Button variant="contained" color="primary" onClick={handleContactClick}>צור קשר</Button>
      <Button 
        variant="contained" 
        color="success" 
        startIcon={<FaWhatsapp />}
        onClick={() => window.open(`https://wa.me/${profile.phoneNumber}`, '_blank')}>
        הודעה
      </Button>
    <DialogComponent 
    open={contactVisible}
     onClose={closeContact}
     title='פרטים ליצירת קשר'
     onConfirm={closeContact}>
          <Box className="contact-info" sx={{ direction: 'rtl', marginTop: '10px', width: '100%', textAlign: 'right' }}>
            <Typography variant="body1">פלאפון: {profile.phoneNumber}</Typography>
            <Typography variant="body1">דוא"ל: {profile.email}</Typography>
          </Box>
    </DialogComponent>
    </Box>
  );
};

export default ProfileActions;