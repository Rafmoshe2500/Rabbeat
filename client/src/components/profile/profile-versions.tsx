// ProfileVersions.tsx
import React, { useState } from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DialogComponent from '../common/dialog';
import RTLTextField from '../common/rtl-text-field'

type ProfileVersionsProps = {
  versions: string[] | undefined;
  canEdit: boolean;
  onUpdate: (value: string[]) => void;
};

const ProfileVersions: React.FC<ProfileVersionsProps> = ({ versions = [], canEdit, onUpdate }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [localVersions, setLocalVersions] = useState<string[]>(versions);

  const handleAddVersion = () => {
    if (newVersion) {
      setLocalVersions([...localVersions, newVersion]);
      setNewVersion('');
      setDialogOpen(false);
    }
  };

  const handleDeleteVersion = (version: string) => {
    setLocalVersions(localVersions.filter(v => v !== version));
  };

  const handleSaveChanges = () => {
    onUpdate(localVersions);
  };

  return (
    <Box sx={{direction: 'rtl', color: 'black'}}>
      <Typography variant="h6">סגנונות קריאה:</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {versions.map((version, index) => (
            <Chip 
              key={index} 
              label={version} 
              onDelete={canEdit ? () => handleDeleteVersion(version) : undefined}
              sx={{ 
                backgroundColor: '#e0e0e0', 
                color: '#333',
                '&:hover': { backgroundColor: '#bdbdbd' }
              }} 
            />
          ))}
        {canEdit && (
          <Chip
            variant='outlined'
            icon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            color="primary"
            style={{ margin: '5px', direction:'ltr'}}
          />
        )}
      </Box>
      {canEdit && localVersions !== versions && (
        <Button onClick={handleSaveChanges} color="primary">
          שמור שינויים
        </Button>
      )}
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