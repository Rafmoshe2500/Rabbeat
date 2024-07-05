import React, { useState, useEffect } from "react";
import styles from "./highlighted-text.module.css";
import { Box, Container } from "@mui/material";
import DisplayText from "../display-lesson-text/display-lesson-text";

interface HighlightedTextProps {
  lesson: Lesson;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
  lesson,
  audioRef,
}) => {
  const [highlightedWord, setHighlightedWord] = useState<WordToMark>();

  const handleTimeUpdate = () => {
    if (audioRef.current && lesson?.text) {
      const currentTime = audioRef.current.currentTime;
      let latestWord: WordToMark | undefined = undefined;
      const { text } = lesson;

      Object.keys(text).forEach((chapterKey) => {
        Object.keys(text[chapterKey]).forEach((verseKey) => {
          Object.keys(text[chapterKey][verseKey]).forEach((wordIndex) => {
            const word = text[chapterKey][verseKey][wordIndex];
            if (word.time <= currentTime) {
              latestWord = {
                chapter: chapterKey,
                verse: verseKey,
                word: parseInt(wordIndex),
              };
            }
          });
        });
      });

      setHighlightedWord(latestWord);
    }
  };

  useEffect(() => {
    const asd = audioRef.current;
    if (asd) {
      const audioElement = audioRef.current;
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [audioRef.current, lesson?.text]);

  return (
    <Container maxWidth="sm">
      <Box className={`${styles["text"]}`} sx={{ bgcolor: "#cfe8fc" }}>
        {lesson?.text && (
          <div>
            <DisplayText
              highlightedWord={highlightedWord}
              text={lesson.text}
              audioRef={audioRef}
            />
          </div>
        )}
      </Box>
    </Container>
  );
};

export default HighlightedText;
