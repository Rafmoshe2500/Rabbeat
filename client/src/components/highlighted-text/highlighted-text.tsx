import React, { useState, useEffect } from "react";
import { Container, useMediaQuery, useTheme } from "@mui/material";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    if (audioRef.current) {
      const audioElement = audioRef.current;
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [audioRef.current, lesson?.text]);

  return (
    <Container
      maxWidth="md"
      sx={{
        paddingLeft: isMobile ? 0 : "16px",
        paddingRight: isMobile ? 0 : "16px",
        width: isMobile ? "100%" : "auto",
      }}
    >
      {lesson?.text && (
        <DisplayText
          text={lesson.text}
          highlightedWord={highlightedWord}
          audioRef={audioRef}
        />
      )}
    </Container>
  );
};

export default HighlightedText;
