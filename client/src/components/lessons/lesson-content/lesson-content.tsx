import React, { useState, useRef, useEffect } from "react";
import "regenerator-runtime/runtime";
import NotesPanel from "../../notes-panel/notes-panel";
import HighlightedText from "../../highlighted-text/highlighted-text";
import styles from "./lesson-content.module.css";
import { StickyNote2 } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import withFade from "../../../hoc/withFade.hoc";

interface LessonContentProps {
  lesson?: Lesson;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isNotesPanelOpen, setIsNotesPanelOpen] = useState<boolean>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [asd, setAsd] = useState("asd");

  const toggleNotesPanel = () => {
    setIsNotesPanelOpen((prev) => !prev);
  };

  useEffect(() => {
    if (lesson?.audio) {
      const url = URL.createObjectURL(lesson.audio);
      setAudioURL(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [lesson?.audio]);

  useEffect(() => {
    setAsd("qwe");
  }, [audioURL]);

  return (
    <div>
      <div>
        {audioURL && (
          <div className={styles["audio-container"]}>
            <audio ref={audioRef} controls>
              <source src={audioURL} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>

            <Tooltip title="ההערות שלי">
              <Button
                variant="contained"
                color="primary"
                onClick={toggleNotesPanel}
                id="notes-button"
              >
                <StickyNote2 />
              </Button>
            </Tooltip>
          </div>
        )}

        {isNotesPanelOpen && (
          <NotesPanel lessonId={lesson!.id!} audioRef={audioRef} />
        )}
        <HighlightedText key={asd} lesson={lesson!} audioRef={audioRef} />
      </div>
    </div>
  );
};

export default withFade(LessonContent);
