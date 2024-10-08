// ProfileActions.tsx
import React, { useState } from 'react';
import { Box, Button, Typography, IconButton, TextField, Snackbar } from '@mui/material';
import { FaWhatsapp, FaEdit, FaSave } from 'react-icons/fa';
import DialogComponent from '../common/dialog';
import {useUser} from '../../contexts/user-context'

type ProfileActionsProps = {
  profile: teacherProfile;
  canEdit: boolean;
  onUpdate: (key: 'phoneNumber', value: string) => void;
};

const ProfileActions: React.FC<ProfileActionsProps> = ({ profile, canEdit, onUpdate }) => {
  const [contactVisible, setContactVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber);
  const {userDetails} = useUser()
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleContactClick = () => {
    setContactVisible(true);
  };

  const closeContact = () => {
    setContactVisible(false);
    setIsEditing(false);
    setPhoneNumber(profile.phoneNumber);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onUpdate('phoneNumber', phoneNumber);
    setIsEditing(false);
  };

const handleWhatsAppClick = () => {
  let phoneNumber = profile.phoneNumber;

  // Remove any non-digit characters
  phoneNumber = phoneNumber.replace(/\D/g, '');

  // Remove leading zero and add country code
  if (phoneNumber.startsWith('0')) {
    phoneNumber = phoneNumber.slice(1);
  }
  phoneNumber = `972${phoneNumber}`; // Assuming this is an Israeli number

  const message = `שלום ${profile.firstName} ${profile.lastName}, כאן ${userDetails?.firstName} ${userDetails?.lastName} מהאתר RabBeat. אני מתעניין בלימודי בר מצווה ואשמח לשוחח ולהתחיל ללמוד. תודה!`;
  const encodedMessage = encodeURIComponent(message);

  // URL for WhatsApp Web
  const webUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}&app_absent=0`;

  // Detect user's device
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;
  const isIPhone = /iPhone/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);

  let urlToUse = webUrl;

  // Adjust URL for mobile devices
  if (isIPhone) {
    urlToUse = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
  } else if (isAndroid) {
    urlToUse = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
  }

  // Create a temporary link to open the URL
  const link = document.createElement('a');
  link.href = urlToUse;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Show Snackbar if WhatsApp does not open
  setTimeout(() => {
    if (!document.hidden) {
      setOpenSnackbar(true); // Ensure `setOpenSnackbar` is defined in your component's state
    }
  }, 2000);
};
  

  return (
    <Box className="profile-actions" sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
      <Button variant="outlined" color="primary" onClick={handleContactClick}>צור קשר</Button>
      {userDetails?.id !== profile.id && (
        <Button 
          variant="contained" 
          color="success" 
          startIcon={<FaWhatsapp />}
          onClick={handleWhatsAppClick}
        >
          הודעה
        </Button>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="לא ניתן לפתוח את WhatsApp. אנא ודא שהאפליקציה מותקנת או נסה להעתיק את המספר ולפתוח ידנית."
      />
      <DialogComponent 
        open={contactVisible}
        onClose={closeContact}
        title='פרטים ליצירת קשר'
      >
        <Box className="contact-info" sx={{ direction: 'rtl', marginTop: '20px', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <Typography variant="body1" sx={{ minWidth: '80px', fontWeight: 'bold' }}>פלאפון:</Typography>
            {isEditing ? (
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <TextField dir='rtl'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ flexGrow: 1, marginRight: '10px' }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSaveClick}
                  sx={{ padding: '8px' }}
                >
                  <FaSave />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <Typography variant="body1" sx={{ flexGrow: 1 }}>{profile.phoneNumber}</Typography>
                {canEdit && (
                  <IconButton
                    color="primary"
                    onClick={handleEditClick}
                    sx={{ padding: '8px' }}
                  >
                    <FaEdit />
                  </IconButton>
                )}
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ minWidth: '80px', fontWeight: 'bold' }}>דוא"ל:</Typography>
            <Typography variant="body1">{profile.email}</Typography>
          </Box>
        </Box>
      </DialogComponent>
    </Box>
  );
};

export default ProfileActions;