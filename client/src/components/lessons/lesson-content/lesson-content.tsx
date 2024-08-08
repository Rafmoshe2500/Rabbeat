import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Divider,
  Grid,
  Collapse,
  useMediaQuery, useTheme
} from "@mui/material";
import { StickyNote2, VolumeUp, VolumeMute } from "@mui/icons-material";
import NotesPanel from "../../notes-panel/notes-panel";
import HighlightedText from "../../highlighted-text/highlighted-text";
import withFade from "../../../hoc/withFade.hoc";
import styles from './lesson-content.module.css';

interface LessonContentProps {
  lesson?: Lesson;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isNotesPanelOpen, setIsNotesPanelOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleNotesPanel = () => {
    setIsNotesPanelOpen((prev) => !prev);
  };

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (lesson?.audio) {
      const url = URL.createObjectURL(lesson.audio);
      setAudioURL(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [lesson?.audio]);

  return (
    <Box className={styles['lesson-content']} sx={{ maxWidth: 800, margin: "0 auto", width: isMobile ? "100%" : "auto" }}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item>
          <Box sx={{ display: "flex", gap: 2 }}>
            {audioURL && (
              <Tooltip title={isPlaying ? "השהה אודיו" : "נגן אודיו"}>
                <IconButton onClick={toggleAudioPlayback} color="primary">
                  {isPlaying ? <VolumeMute /> : <VolumeUp />}
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={isNotesPanelOpen ? "סגור הערות" : "פתח הערות"}>
              <IconButton onClick={toggleNotesPanel} color="primary">
                <StickyNote2 />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      <Collapse in={isNotesPanelOpen}>
        {lesson && lesson.id && (
          <NotesPanel lessonId={lesson.id} audioRef={audioRef} />
        )}
      </Collapse>
      <Box sx={{ mt: 1, width: isMobile ? "100%" : "auto" }}>
        <HighlightedText lesson={lesson!} audioRef={audioRef} />
      </Box>

      {audioURL && (
        <audio
          ref={audioRef}
          src={audioURL}
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </Box>
  );
};

export default withFade(LessonContent);
