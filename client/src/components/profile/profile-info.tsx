// ProfileInfo.tsx
import React, { useState } from 'react';
import { Box, Typography, IconButton, Button, Tooltip } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import RTLTextField from '../common/rtl-text-field';

type EditableField = 'aboutMe' | 'address';

type ProfileInfoProps = {
  profile: teacherProfile;
  canEdit: boolean;
  onUpdate: (key: EditableField, value: string) => void;
};

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile, canEdit, onUpdate }) => {
  const [localProfile, setLocalProfile] = useState(profile);
  const [editMode, setEditMode] = useState({
    aboutMe: false,
    address: false,
  });

  const handleEdit = (field: EditableField) => {
    if (canEdit) {
      setEditMode({ ...editMode, [field]: true });
    }
  };

  const handleChange = (field: EditableField, value: string) => {
    setLocalProfile({ ...localProfile, [field]: value });
  };

  const handleSave = (field: EditableField) => {
    setEditMode({ ...editMode, [field]: false });
    onUpdate(field, localProfile[field]);
  };

  const handleCancel = (field: EditableField) => {
    setEditMode({ ...editMode, [field]: false });
    setLocalProfile({ ...localProfile, [field]: profile[field] });
  };

  const renderField = (field: EditableField, label: string) => {
    return (
      <Box key={field}>
        <Tooltip title={label} placement="right">
        {editMode[field] ? (
          <>
            <RTLTextField dir='rtl'
              fullWidth
              multiline
              label={label}
              rows={4}
              value={localProfile[field]}
              onChange={(e) => handleChange(field, e.target.value)}
            />
            <Button onClick={() => handleSave(field)}>שמור</Button>
            <Button onClick={() => handleCancel(field)}>בטל</Button>
          </>
        ) : (
          <Box display="flex" alignItems="flex-start">
            <Typography 
              variant="body1" 
              sx={{ 
                direction: 'rtl',
                flexGrow: 1, 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              <strong><u>{label}</u><br/></strong> {profile[field]}
            </Typography>
            {canEdit && (
              <IconButton size="small" onClick={() => handleEdit(field)}>
                <EditIcon />
              </IconButton>
            )}
          </Box>
        )}
        </Tooltip>
      </Box>
    );
  };

  return (
    <Box className="profile-info" sx={{padding: '5px', textAlign:'right'}}>
      {renderField('aboutMe', 'על עצמי')}
      {<br/>}
      {renderField('address', 'כתובת')}
    </Box>
  );
};

export default ProfileInfo;