import React, { useState, useEffect } from 'react';
import { Box, Chip, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DialogComponent from '../common/dialog';
import RTLTextField from '../common/rtl-text-field';

type ProfileSamplesProps = {
  samples: string[] | null;
  canEdit: boolean;
  onUpdate: (key: 'sampleIds', value: string[]) => void;
};

const ProfileSamples: React.FC<ProfileSamplesProps> = ({ samples, canEdit, onUpdate }) => {
  const [localSamples, setLocalSamples] = useState<string[]>([]);
  const [samplesDialogOpen, setSamplesDialogOpen] = useState(false);
  const [newSampleDialogOpen, setNewSampleDialogOpen] = useState(false);
  const [newSample, setNewSample] = useState('');

  useEffect(() => {
    if (samples) {
      setLocalSamples(samples);
    }
  }, [samples]);

  const handleAddSample = () => {
    if (newSample) {
      const updatedSamples = [...localSamples, newSample];
      setLocalSamples(updatedSamples);
      setNewSample('');
      setNewSampleDialogOpen(false);
    }
  };

  const handleDeleteSample = (sample: string) => {
    const updatedSamples = localSamples.filter(s => s !== sample);
    setLocalSamples(updatedSamples);
  };

  const handleConfirm = () => {
    console.log('Sending samples update:', localSamples);
    onUpdate('sampleIds', localSamples);
    setSamplesDialogOpen(false);
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
        onConfirm={handleConfirm}
      >
        <Box display="flex" flexWrap="wrap" justifyContent="center">
          {localSamples.map((sample, index) => (
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