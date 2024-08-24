import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  List,
  ListItem,
  Typography,
  IconButton,
  TextField,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Mic as MicIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
} from "@mui/icons-material";
import DialogComponent from "../common/dialog";
import { useTheme } from "@mui/material/styles";
import AudioRecorder from "../audio-recorder/audio-recorder";
import { useSamples } from "../../hooks/useProfile";
import { useUser } from "../../contexts/user-context";
import { Slider } from "@mui/material";
import { styled } from "@mui/material/styles";
import useToaster from "../../hooks/useToaster";
import Toaster from "../common/toaster";

type ProfileSamplesProps = {
  teacherId: string;
  countSample?: number;
};

const CustomSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 4,
  "& .MuiSlider-thumb": {
    width: 8,
    height: 8,
    transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
    "&:before": {
      boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
    },
    "&:hover, &.Mui-focusVisible": {
      boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}33`,
    },
    "&.Mui-active": {
      width: 12,
      height: 12,
    },
  },
  "& .MuiSlider-rail": {
    opacity: 0.28,
  },
}));

const ProfileSamples: React.FC<ProfileSamplesProps> = ({
  teacherId,
  countSample = 0,
}) => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [samplesDialogOpen, setSamplesDialogOpen] = useState(false);
  const [addSampleDialogOpen, setAddSampleDialogOpen] = useState(false);
  const [newSampleTitle, setNewSampleTitle] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const theme = useTheme();
  const { userDetails } = useUser();
  const { createSample, deleteSample, getSamples, isDeleting } =
    useSamples(teacherId);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const [audioDurations, setAudioDurations] = useState<{
    [key: string]: number;
  }>({});
  const [currentTimes, setCurrentTimes] = useState<{ [key: string]: number }>(
    {}
  );
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const { toaster, setToaster, handleCloseToaster } = useToaster();

  useEffect(() => {
    const interval = setInterval(() => {
      const newCurrentTimes: { [key: string]: number } = {};
      samples.forEach((sample) => {
        const audio = audioRefs.current[sample.id];
        if (audio) {
          newCurrentTimes[sample.id] = audio.currentTime;
          if (
            !isFinite(audioDurations[sample.id]) &&
            isFinite(audio.duration)
          ) {
            setAudioDurations((prev) => ({
              ...prev,
              [sample.id]: audio.duration,
            }));
          }
        }
      });
      setCurrentTimes(newCurrentTimes);
    }, 10);

    return () => clearInterval(interval);
  }, [samples, audioDurations]);

  const handleLoadedMetadata = (
    sampleId: string,
    e: React.SyntheticEvent<HTMLAudioElement>
  ) => {
    const audio = e.target as HTMLAudioElement;
    if (isFinite(audio.duration) && audio.duration > 0) {
      setAudioDurations((prev) => ({ ...prev, [sampleId]: audio.duration }));
    }
  };

  const togglePlayPause = (sampleId: string) => {
    const audio = audioRefs.current[sampleId];
    if (audio) {
      if (isPlaying[sampleId]) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying((prev) => ({ ...prev, [sampleId]: !prev[sampleId] }));
    }
  };

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
        teacherId: teacherId,
      };
      createSample(newSample, {
        onSuccess: (newSample) => {
          setSamples((prevSamples) => [...prevSamples, newSample]);
          setNewSampleTitle("");
          setAudioBlob(null);
          setAddSampleDialogOpen(false);
          setToaster({
            open: true,
            message: "דוגמא נוספה בהצלחה",
            color: "success",
          });
        },
        onError: () => {
          setToaster({
            open: true,
            message: "קרתה תקלה בעת הוספת הדוגמא, אנא נסה שנית",
            color: "error",
          });
        },
      });
    }
  };

  const handleDeleteSample = (sampleId: string) => {
    deleteSample(sampleId, {
      onSuccess: () => {
        setToaster({
          open: true,
          message: "דוגמא נמחקה בהצלחה",
          color: "success",
        });
        setSamples((prevSamples) =>
          prevSamples.filter((sample) => sample.id !== sampleId)
        );
      },
      onError: () => {
        setToaster({
          open: true,
          message: "קרתה תקלה בעת מחיקת הדוגמא, אנא נסה שנית",
          color: "error",
        });
      },
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

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Box
      sx={{
        marginTop: theme.spacing(2.5),
        display: "flex",
        justifyContent: "center",
      }}
    >
      <IconButton
        onClick={() => setSamplesDialogOpen(true)}
        sx={{ color: theme.palette.text.primary }}
      >
        <MicIcon />
        <Typography variant="caption" sx={{ ml: theme.spacing(1) }}>
          {countSample} דוגמאות שמע
        </Typography>
      </IconButton>

      <DialogComponent
        open={samplesDialogOpen}
        title="דוגמאות אודיו"
        onClose={() => setSamplesDialogOpen(false)}
        onConfirm={() => setSamplesDialogOpen(false)}
      >
        <List>
          {samples.map((sample, index) => (
            <React.Fragment key={sample.id}>
              {index > 0 && <Divider />}
              <ListItem sx={{ flexDirection: "column", alignItems: "stretch" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    mb: 1,
                  }}
                >
                  <IconButton onClick={() => togglePlayPause(sample.id)}>
                    {isPlaying[sample.id] ? <PauseIcon /> : <PlayArrowIcon />}
                  </IconButton>
                  <Typography variant="body2" sx={{ flexGrow: 1, ml: 2 }}>
                    {sample.title}
                  </Typography>
                  {userDetails && teacherId === userDetails.id && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() =>
                        !isDeleting && handleDeleteSample(sample.id)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <CustomSlider
                    size="small"
                    value={currentTimes[sample.id] || 0}
                    max={audioDurations[sample.id] || 100}
                    onChange={(_, newValue) => {
                      const audio = audioRefs.current[sample.id];
                      if (audio) {
                        audio.currentTime = newValue as number;
                        setCurrentTimes((prev) => ({
                          ...prev,
                          [sample.id]: newValue as number,
                        }));
                      }
                    }}
                    onChangeCommitted={(_, newValue) => {
                      const audio = audioRefs.current[sample.id];
                      if (audio) {
                        audio.currentTime = newValue as number;
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ ml: 2, minWidth: 40 }}>
                    {formatTime(currentTimes[sample.id] || 0)}
                  </Typography>
                </Box>
                <audio
                  ref={(el) => {
                    if (el) audioRefs.current[sample.id] = el;
                  }}
                  src={sample.audio}
                  onLoadedMetadata={(e) => handleLoadedMetadata(sample.id, e)}
                  onTimeUpdate={(e) => {
                    const audio = e.target as HTMLAudioElement;
                    setCurrentTimes((prev) => ({
                      ...prev,
                      [sample.id]: audio.currentTime,
                    }));
                  }}
                  onDurationChange={(e) => {
                    const audio = e.target as HTMLAudioElement;
                    setAudioDurations((prev) => ({
                      ...prev,
                      [sample.id]: audio.duration,
                    }));
                  }}
                  onEnded={() =>
                    setIsPlaying((prev) => ({ ...prev, [sample.id]: false }))
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
        {userDetails && teacherId === userDetails.id && (
          <IconButton
            color="primary"
            onClick={() => setAddSampleDialogOpen(true)}
            sx={{ padding: theme.spacing(1) }}
          >
            <AddIcon />
          </IconButton>
        )}
      </DialogComponent>

      <DialogComponent
        open={addSampleDialogOpen}
        title="הוסף אודיו חדש"
        onClose={() => setAddSampleDialogOpen(false)}
        onConfirm={handleAddSample}
      >
        <TextField
          dir="rtl"
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
      <Toaster
        message={toaster.message}
        open={toaster.open}
        color={toaster.color}
        onClose={handleCloseToaster}
      />
    </Box>
  );
};

export default ProfileSamples;
