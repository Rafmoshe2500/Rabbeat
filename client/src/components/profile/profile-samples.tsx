import React, { useState, useEffect } from 'react';
import { Box, Chip, Typography, IconButton, TextField } from '@mui/material';
import { Add as AddIcon, Mic as MicIcon } from '@mui/icons-material';
import DialogComponent from '../common/dialog';
import { useTheme } from '@mui/material/styles';

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
  const theme = useTheme();

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
    <Box sx={{ marginTop: theme.spacing(2.5), display: 'flex', justifyContent: 'center' }}>
      <IconButton 
        onClick={() => setSamplesDialogOpen(true)}
        sx={{ color: theme.palette.text.primary }}
      >
        <MicIcon />
        <Typography variant="caption" sx={{ ml: theme.spacing(1) }}>
          {samples!.length} דוגמאות שמע
        </Typography>
      </IconButton>
      
      <DialogComponent
        open={samplesDialogOpen}
        title="דוגמאות אודיו"
        onClose={() => setSamplesDialogOpen(false)}
        onConfirm={() => setSamplesDialogOpen(false)}
      >
        <Box sx={{ marginTop: theme.spacing(2.5), width: '100%' }}>
          <Box display="flex" flexWrap="wrap" justifyContent="center" sx={{ marginBottom: theme.spacing(2.5) }}>
            {localSamples.map((sample, index) => (
              <Chip
                key={index}
                label={sample}
                onDelete={canEdit ? () => handleDeleteSample(sample) : undefined}
                sx={{ margin: theme.spacing(0.625), bgcolor: theme.palette.secondary.light, color: theme.palette.text.primary }}
              />
            ))}
          </Box>
          {canEdit && (
            <IconButton
              color="primary"
              onClick={() => setAddSampleDialogOpen(true)}
              sx={{ padding: theme.spacing(1) }}
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
        <TextField
          dir='rtl'
          value={newSample}
          onChange={(e) => setNewSample(e.target.value)}
          variant="outlined"
          size="small"
          placeholder="הוסף דוגמה חדשה"
          sx={{ flexGrow: 1, marginBottom: theme.spacing(1.25) }}
        />
      </DialogComponent>
    </Box>
  );
};

export default ProfileSamples;