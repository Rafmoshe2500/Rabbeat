// src/components/common/AudioSlider.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Box, Slider, Typography, IconButton } from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const CustomSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 4,
  '& .MuiSlider-thumb': {
    width: 8,
    height: 8,
    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
    '&:before': {
      boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
    },
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}33`,
    },
    '&.Mui-active': {
      width: 12,
      height: 12,
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.28,
  },
}));

interface AudioSliderProps {
  audioSrc: string;
  title?: string;
  onDelete?: () => void;
  showDeleteButton?: boolean | undefined;
}

const AudioSlider: React.FC<AudioSliderProps> = ({
  audioSrc,
  title,
  onDelete,
  showDeleteButton = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(new Audio(audioSrc));

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = audioSrc;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [audioSrc]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
        <IconButton onClick={togglePlayPause}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        {title && (
          <Typography variant="body2" sx={{ flexGrow: 1, ml: 2 }}>
            {title}
          </Typography>
        )}
        {showDeleteButton && onDelete && (
          <IconButton edge="end" aria-label="delete" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <CustomSlider
          size="small"
          value={currentTime}
          max={duration || 100}
          onChange={handleSliderChange}
        />
        <Typography variant="caption" sx={{ ml: 2, minWidth: 40 }}>
          {formatTime(currentTime)}
        </Typography>
      </Box>
    </Box>
  );
};

export default AudioSlider;
