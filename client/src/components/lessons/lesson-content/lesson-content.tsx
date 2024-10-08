import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Divider,
  Grid,
  Collapse,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import { StickyNote2, VolumeUp, VolumeMute } from "@mui/icons-material";
import NotesPanel from "../../notes-panel/notes-panel";
import HighlightedText from "../../highlighted-text/highlighted-text";
import withFade from "../../../hoc/withFade.hoc";
import styles from "./lesson-content.module.css";
import { useUser } from "../../../contexts/user-context";
import { formatVerseReference } from "../../../utils/utils";

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
  const { userDetails } = useUser();
  const formattedString = formatVerseReference(
    lesson!.startChapter,
    lesson!.endChapter,
    lesson!.startVerse,
    lesson!.endVerse
  );
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

      return () => URL.revokeObjectURL(`${audioURL}`);
    }
  }, [lesson?.id]);

  return (
    <Box
      sx={{
        margin: "0 auto",
        width: isMobile ? "100%" : "auto",
      }}
    >
      <Box
        mr={"10px"}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5">{lesson?.title}</Typography>
        <Typography variant="subtitle1" gutterBottom>
          {`${lesson?.pentateuch} - `}
          {formattedString}
        </Typography>
      </Box>
      <Box className={styles["lesson-content"]}>
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
              {userDetails?.type === "student" && (
                <Tooltip title={isNotesPanelOpen ? "סגור הערות" : "פתח הערות"}>
                  <IconButton onClick={toggleNotesPanel} color="primary">
                    <StickyNote2 />
                  </IconButton>
                </Tooltip>
              )}
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
            onPlay={() => {
              !isPlaying && setIsPlaying(true);
            }}
            onEnded={() => setIsPlaying(false)}
          />
        )}
      </Box>
    </Box>
  );
};

export default withFade(LessonContent);
