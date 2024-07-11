import React, { useState, useEffect } from 'react';
import { Box, Chip, Typography, IconButton } from '@mui/material';
import { Add as AddIcon, Mic as MicIcon } from '@mui/icons-material';
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
  const [addSampleDialogOpen, setAddSampleDialogOpen] = useState(false);
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
      onUpdate('sampleIds', updatedSamples);
      setNewSample('');
      setAddSampleDialogOpen(false);
    }
  };

  const handleDeleteSample = (sample: string) => {
    const updatedSamples = localSamples.filter(s => s !== sample);
    setLocalSamples(updatedSamples);
    onUpdate('sampleIds', updatedSamples);
  };

  return (
    <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
      <IconButton 
        onClick={() => setSamplesDialogOpen(true)}
        sx={{ color: 'black' }}
      >
        <MicIcon />
        <Typography variant="caption" sx={{ ml: 1 }}>
          {samples!.length} דוגמאות שמע
        </Typography>
      </IconButton>
      
      <DialogComponent
        open={samplesDialogOpen}
        title="דוגמאות אודיו"
        onClose={() => setSamplesDialogOpen(false)}
        onConfirm={() => setSamplesDialogOpen(false)}
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
            <IconButton
              color="primary"
              onClick={() => setAddSampleDialogOpen(true)}
              sx={{ padding: '8px' }}
            >
              <AddIcon />
            </IconButton>
          )}
        </Box>
      </DialogComponent>
      
      {/* Add new sample dialog */}
      <DialogComponent
        open={addSampleDialogOpen}
        title="הוסף אודיו חדש"
        onClose={() => setAddSampleDialogOpen(false)}
        onConfirm={handleAddSample}
      >
        <RTLTextField
          dir='rtl'
          value={newSample}
          onChange={(e) => setNewSample(e.target.value)}
          variant="outlined"
          size="small"
          placeholder="הוסף דוגמה חדשה"
          sx={{ flexGrow: 1, marginBottom: '10px' }}
        />
      </DialogComponent>
    </Box>
  );
};

export default ProfileSamples;