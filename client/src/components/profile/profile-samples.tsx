import React, { useState, useEffect } from 'react';
import { Box, Chip, Button, IconButton } from '@mui/material';
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
    }
  };

  const handleDeleteSample = (sample: string) => {
    const updatedSamples = localSamples.filter(s => s !== sample);
    setLocalSamples(updatedSamples);
  };

  const handleConfirm = () => {
    onUpdate('sampleIds', localSamples);
    setSamplesDialogOpen(false);
  };

  return (
    <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
      <Button onClick={() => setSamplesDialogOpen(true)}>
        הצג דוגמאות
      </Button>
      <DialogComponent
        open={samplesDialogOpen}
        title="דוגמאות אודיו"
        onClose={() => setSamplesDialogOpen(false)}
        onConfirm={handleConfirm}
      >
        <Box sx={{ marginTop: '20px', width: '100%' }}>
          <Box display="flex" flexWrap="wrap" justifyContent="center" sx={{ marginBottom: '20px' }}>
              {localSamples.map((sample, index) => (
              <Chip
                key={index}
                label={sample}
                onDelete={canEdit ? () => handleDeleteSample(sample) : undefined}
                sx={{ margin: '5px' }}
              />
            ))}
          </Box>
          {canEdit && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RTLTextField dir='rtl'
                value={newSample}
                onChange={(e) => setNewSample(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="הוסף דוגמה חדשה"
                sx={{ flexGrow: 1, marginRight: '10px' }}
              />
              <IconButton
                color="primary"
                onClick={handleAddSample}
                sx={{ padding: '8px' }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </DialogComponent>
    </Box>
  );
};

export default ProfileSamples;