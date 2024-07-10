// ProfileInfo.tsx
import React, { useState } from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

type ProfileInfoProps = {
  profile: teacherProfile;
  canEdit: boolean;
  onUpdate: (updatedProfile: Partial<teacherProfile>) => void;
};

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile, canEdit, onUpdate }) => {
  const [editMode, setEditMode] = useState({
    aboutMe: false,
    email: false,
    phoneNumber: false,
    address: false,
  });

  const handleEdit = (field: keyof typeof editMode) => {
    if (canEdit) {
      setEditMode({ ...editMode, [field]: true });
    }
  };

  const handleSave = (field: keyof typeof editMode) => {
    setEditMode({ ...editMode, [field]: false });
    onUpdate(profile);
  };

  const handleChange = (field: keyof teacherProfile, value: string) => {
    onUpdate({ [field]: value });
  };

  const renderField = (field: keyof teacherProfile) => {
    const value = profile[field];
    if (typeof value === 'string' || typeof value === 'number') {
      return value.toString();
    } else if (Array.isArray(value)) {
      return 'Array field'; // You might want to customize this for specific array fields
    } else {
      return 'Complex field'; // You might want to customize this for specific object fields
    }
  };

  const editableFields: (keyof teacherProfile)[] = ['aboutMe', 'address'];

  return (
    <Box className="profile-info" >
      {editableFields.map((field) => (
        <Box key={field}>
          {editMode[field as keyof typeof editMode] ? (
            <TextField
              fullWidth
              value={profile[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleSave(field as keyof typeof editMode)}
            />
          ) : (
            <Typography variant="body1" onClick={() => handleEdit(field as keyof typeof editMode)}>
              {renderField(field)}
              {canEdit && <IconButton size="small"><EditIcon /></IconButton>}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default ProfileInfo;