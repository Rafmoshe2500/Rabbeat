// ProfileActions.tsx
import React, { useState } from 'react';
import { Box, Button, Typography, IconButton, TextField } from '@mui/material';
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

  return (
    <Box className="profile-actions" sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
      <Button variant="outlined" color="primary" onClick={handleContactClick}>צור קשר</Button>
      {userDetails?.id !== profile.id &&  <Button 
        variant="contained" 
        color="success" 
        startIcon={<FaWhatsapp />}
        onClick={() => window.open(`https://wa.me/${profile.phoneNumber}`, '_blank')}
      >
        הודעה
      </Button>}
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