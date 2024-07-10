// ProfileSamples.tsx
import React, { useState } from 'react';
import { Box, Chip, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DialogComponent from '../common/dialog';
import RTLTextField from '../common/rtl-text-field';

type ProfileSamplesProps = {
  samples: string[];
  canEdit: boolean;
  onUpdate: (samples: string[]) => void;
};

const ProfileSamples: React.FC<ProfileSamplesProps> = ({ samples, canEdit, onUpdate }) => {
  const [samplesDialogOpen, setSamplesDialogOpen] = useState(false);
  const [newSampleDialogOpen, setNewSampleDialogOpen] = useState(false);
  const [newSample, setNewSample] = useState('');

  const handleAddSample = () => {
    if (newSample) {
      onUpdate([...samples, newSample]);
      setNewSample('');
      setNewSampleDialogOpen(false);
    }
  };

  const handleDeleteSample = (sample: string) => {
    onUpdate(samples.filter(s => s !== sample));
  };

  return (
    <Box>
      <Button onClick={() => setSamplesDialogOpen(true)}>
        הצג דוגמאות
      </Button>
      <DialogComponent
        open={samplesDialogOpen}
        title="דוגמאות אודיו"
        onClose={() => setSamplesDialogOpen(false)}
        onConfirm={() => setSamplesDialogOpen(false)}
      >
        <Box display="flex" flexWrap="wrap" justifyContent="center">
          {samples.map((sample, index) => (
            <Chip
              key={index}
              label={sample}
              onDelete={canEdit ? () => handleDeleteSample(sample) : undefined}
              style={{ margin: '5px' }}
            />
          ))}
        </Box>
        {canEdit && (
          <Button 
            onClick={() => setNewSampleDialogOpen(true)} 
            startIcon={<AddIcon />}
            color="primary"
          >
            הוסף דוגמה חדשה
          </Button>
        )}
      </DialogComponent>

      <DialogComponent
        open={newSampleDialogOpen}
        title="הוסף דוגמה חדשה"
        onClose={() => setNewSampleDialogOpen(false)}
        onConfirm={handleAddSample}
      >
        <RTLTextField
          autoFocus
          margin="dense"
          label="דוגמה חדשה"
          fullWidth
          value={newSample}
          onChange={(e) => setNewSample(e.target.value)}
        />
      </DialogComponent>
    </Box>
  );
};

export default ProfileSamples;