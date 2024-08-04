import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import { styled } from "@mui/system";
import DisplayText from "../display-lesson-text/display-lesson-text";

interface HighlightedTextProps {
  lesson: Lesson;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const TextContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#f8f9fa",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  '& .highlighted': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  },
}));

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
    if (audioRef.current) {
      const audioElement = audioRef.current;
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [audioRef.current, lesson?.text]);

  return (
    <Container maxWidth="md">
      <TextContainer>
        {lesson?.text && (
          <DisplayText
            text={lesson.text}
            highlightedWord={highlightedWord}
            audioRef={audioRef}
          />
        )}
      </TextContainer>
    </Container>
  );
};

export default HighlightedText;