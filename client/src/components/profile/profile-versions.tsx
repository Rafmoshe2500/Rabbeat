// ProfileVersions.tsx
import React, { useState } from 'react';
import { Box, Typography, Chip, } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DialogComponent from '../common/dialog';
import RTLTextField from '../common/rtl-text-field'

type ProfileVersionsProps = {
  versions: string[];
  canEdit: boolean;
  onUpdate: (versions: string[]) => void;
};

const ProfileVersions: React.FC<ProfileVersionsProps> = ({ versions, canEdit, onUpdate }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newVersion, setNewVersion] = useState('');

  const handleAddVersion = () => {
    if (newVersion) {
      onUpdate([...versions, newVersion]);
      setNewVersion('');
      setDialogOpen(false);
    }
  };

  const handleDeleteVersion = (version: string) => {
    onUpdate(versions.filter(v => v !== version));
  };

  return (
    <Box sx={{direction: 'rtl', color: 'black'}}>
      <Typography variant="h6">סגנונות קריאה:</Typography>
      <Box display="flex" flexWrap="wrap" justifyContent="center">
        {versions.map((version, index) => (
          <Chip
            key={index}
            label={version}
            onDelete={canEdit ? () => handleDeleteVersion(version) : undefined}
            style={{ margin: '5px' }}
          />
        ))}
        {canEdit && (
          <Chip
            icon={<AddIcon />}
            label="הוסף סגנון"
            onClick={() => setDialogOpen(true)}
            color="primary"
            style={{ margin: '5px' }}
          />
        )}
      </Box>
      <DialogComponent
        open={dialogOpen}
        title="הוסף סגנון קריאה חדש"
        onClose={() => setDialogOpen(false)}
        onConfirm={handleAddVersion}
      >
        <RTLTextField
          autoFocus
          margin="dense"
          label="סגנון קריאה"
          fullWidth
          value={newVersion}
          onChange={(e) => setNewVersion(e.target.value)}
        />
      </DialogComponent>
    </Box>
  );
};

export default ProfileVersions;