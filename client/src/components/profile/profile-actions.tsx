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
    
    // If the number doesn't start with 972, add it
    if (!phoneNumber.startsWith('972')) {
      phoneNumber = phoneNumber.startsWith('0') ? phoneNumber.slice(1) : phoneNumber;
      phoneNumber = `+972${phoneNumber}`;
    }

    const message = encodeURIComponent(`שלום ${profile.firstName} ${profile.lastName}, אני פונה אליך דרך אתר RabBeat. אני מעוניין ליצור איתך קשר על מנת לתאם איתך מספר שיעורים ללימוד לבר המצווה שלי. תודה`);

    // URLs for different platforms
    const iphoneUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    const androidUrl = `intent://send/${phoneNumber}#Intent;scheme=smsto;package=com.whatsapp;action=android.intent.action.SENDTO;end`;
    const webUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

    // Detect platform
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIPhone = /iPhone/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);

    let urlToUse = webUrl;
    if (isIPhone) urlToUse = iphoneUrl;
    if (isAndroid) urlToUse = androidUrl;

    // Try to open WhatsApp
    const link = document.createElement('a');
    link.href = urlToUse;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Set a timeout to check if WhatsApp opened
    setTimeout(() => {
      if (!document.hidden) {
        setOpenSnackbar(true);
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
        onConfirm={closeContact}
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