// ProfileSamples.tsx

import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, Typography, IconButton, TextField } from '@mui/material';
import { Add as AddIcon, Mic as MicIcon, Delete as DeleteIcon } from '@mui/icons-material';
import DialogComponent from '../common/dialog';
import { useTheme } from '@mui/material/styles';
import AudioRecorder from '../audio-recorder/audio-recorder';
import { useSamples } from '../../hooks/useProfile';
import { useUser } from '../../contexts/user-context';

type ProfileSamplesProps = {
  teacherId: string;
};

const ProfileSamples: React.FC<ProfileSamplesProps> = ({ teacherId }) => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [samplesDialogOpen, setSamplesDialogOpen] = useState(false);
  const [addSampleDialogOpen, setAddSampleDialogOpen] = useState(false);
  const [newSampleTitle, setNewSampleTitle] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const theme = useTheme();
  const { userDetails } = useUser()
  const { createSample, deleteSample, getSamples, isDeleting } = useSamples(teacherId);

  useEffect(() => {
    if (samplesDialogOpen) {
      getSamples(undefined, {
        onSuccess: (data: Sample[]) => {
          setSamples(data);
        },
      });
    }
  }, [samplesDialogOpen, getSamples]);

  const handleAddSample = async () => {
    if (newSampleTitle && audioBlob) {
      const base64Audio = await blobToBase64(audioBlob);
      const newSample = {
        audio: base64Audio,
        title: newSampleTitle,
        teacherId: teacherId
      };
      createSample(newSample, {
        onSuccess: (newSample) => {
          setSamples((prevSamples) => [...prevSamples, newSample]);
          setNewSampleTitle('');
          setAudioBlob(null);
          setAddSampleDialogOpen(false);
        }
      });
    }
};

  const handleDeleteSample = (sampleId: string) => {
    deleteSample(sampleId, {
      onSuccess: () => {
        setSamples((prevSamples) => prevSamples.filter((sample) => sample.id !== sampleId));
      }
    });
  };

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <Box sx={{ marginTop: theme.spacing(2.5), display: 'flex', justifyContent: 'center' }}>
      <IconButton 
        onClick={() => setSamplesDialogOpen(true)}
        sx={{ color: theme.palette.text.primary }}
      >
        <MicIcon />
        <Typography variant="caption" sx={{ ml: theme.spacing(1) }}>
          דוגמאות שמע
        </Typography>
      </IconButton>
      
      <DialogComponent
        open={samplesDialogOpen}
        title="דוגמאות אודיו"
        onClose={() => setSamplesDialogOpen(false)}
        onConfirm={() => setSamplesDialogOpen(false)}
      >
        <List>
          {samples.map((sample) => (
            <ListItem
              key={sample.id}
              secondaryAction={ teacherId === userDetails!.id &&
                <IconButton edge="end" aria-label="delete" onClick={() => !isDeleting && handleDeleteSample(sample.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={sample.title}
                secondary={
                  <audio controls src={sample.audio}>
                    Your browser does not support the audio element.
                  </audio>
                }
              />
            </ListItem>
          ))}
        </List>
        {teacherId === userDetails!.id && <IconButton
          color="primary"
          onClick={() => setAddSampleDialogOpen(true)}
          sx={{ padding: theme.spacing(1) }}
        >
          <AddIcon />
        </IconButton>}
      </DialogComponent>
      
      <DialogComponent
        open={addSampleDialogOpen}
        title="הוסף אודיו חדש"
        onClose={() => setAddSampleDialogOpen(false)}
        onConfirm={handleAddSample}
      >
        <TextField
          dir='rtl'
          value={newSampleTitle}
          onChange={(e) => setNewSampleTitle(e.target.value)}
          variant="outlined"
          size="small"
          placeholder="כותרת לדוגמה"
          sx={{ flexGrow: 1, marginBottom: theme.spacing(1.25) }}
        />
        <AudioRecorder
          onRecordingComplete={handleRecordingComplete}
          shouldDisplayTranscript={false}
          shouldCalculateHighlights={false}
          language="iw-IL"
        />
      </DialogComponent>
    </Box>
  );
};

export default ProfileSamples;