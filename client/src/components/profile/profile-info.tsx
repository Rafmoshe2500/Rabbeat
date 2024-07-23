// ProfileInfo.tsx
import React, { useState } from 'react';
import { Box, Typography, IconButton, Button, Tooltip } from '@mui/material';
import { FaEdit } from 'react-icons/fa';
import RTLTextField from '../common/rtl-text-field';
import { useTheme } from '@mui/material/styles';

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
  const theme = useTheme();

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
            <Button onClick={() => handleSave(field)} sx={{ color: theme.palette.primary.main }}>שמור</Button>
            <Button onClick={() => handleCancel(field)} sx={{ color: theme.palette.text.secondary }}>בטל</Button>
          </>
        ) : (
          <Box display="flex" alignItems="flex-start">
            <Typography 
              variant="body1" 
              sx={{ 
                direction: 'rtl',
                flexGrow: 1, 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: theme.palette.text.primary,
              }}
            >
              <strong><u>{label}</u><br/></strong> {profile[field]}
            </Typography>
            {canEdit && (
              <IconButton size="small" onClick={() => handleEdit(field)} sx={{ color: theme.palette.primary.main }}>
                <FaEdit />
              </IconButton>
            )}
          </Box>
        )}
        </Tooltip>
      </Box>
    );
  };

  return (
    <Box className="profile-info" sx={{padding: theme.spacing(0.625), textAlign:'right'}}>
      {renderField('aboutMe', 'על עצמי')}
      {<br/>}
      {renderField('address', 'כתובת')}
    </Box>
  );
};

export default ProfileInfo;