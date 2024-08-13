import React, { useState } from "react";
import { Box, Typography, Container, useTheme, styled } from "@mui/material";
import VersionSelector from "../text-version-selector/text-version-selector";

interface DisplayTextProps {
  text: TextSection;
  highlightedWord?: WordToMark;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

const TextContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
}));

const DisplayText: React.FC<DisplayTextProps> = ({
  text: textSection,
  highlightedWord,
  audioRef,
}) => {
  const [version, setVersion] = useState<Version>("none");
  const [isTorahFontEnabled, setIsTorahFontEnabled] = useState<boolean>(false);
  const theme = useTheme();
  const handleVersionChange = (newVersion: Version) => {
    setVersion(newVersion);
  };

  const handleTorahFontChange = (isEnabled: boolean) => {
    setIsTorahFontEnabled(isEnabled);
    if (isEnabled) {
      setVersion("none");
    }
  };

  const handleWordClick = (timestamp: number) => {
    if (audioRef?.current) {
      audioRef.current.currentTime = timestamp;
      audioRef.current.play();
    }
  };

  const renderWord = (word: string, isHighlighted: boolean) => {
    const trimmedWord = word.trim();
    const leadingSpaces = word.match(/^\s*/)?.[0] || "";
    const trailingSpaces = word.match(/\s*$/)?.[0] || "";

    return (
      <>
        {leadingSpaces}
        <Box
          component="span"
          sx={{
            backgroundColor: isHighlighted ? "#8B4513" : "transparent",
            color: isHighlighted ? "#FFFFFF" : theme.palette.text.primary,
            borderRadius: isHighlighted ? "7px" : 0,
            cursor: "pointer",
            display: "inline-block",
          }}
        >
          {trimmedWord}
        </Box>
        {trailingSpaces}
      </>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ width: "100%", padding: "0 !important" }}>
      <TextContainer>
        <Box
          sx={{
            height: 400,
            overflow: "auto",
            overflowX: "hidden",
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="body1"
            component="div"
            sx={{
              fontFamily: isTorahFontEnabled
                ? "StamFont, Arial, sans-serif"
                : "Arial, sans-serif",
              fontSize: "1.25rem",
              direction: "rtl",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {Object.keys(textSection).map((chapterKey) => (
              <Box key={chapterKey} mb={3}>
                <Typography variant="h2" gutterBottom>
                  פרק {chapterKey}
                </Typography>
                {Object.keys(textSection[chapterKey]).map((verseKey) => (
                  <Box
                    key={verseKey}
                    mb={2}
                    sx={{ display: "flex", flexWrap: "wrap" }}
                  >
                    <Typography
                      component="span"
                      fontWeight="bold"
                      fontSize="1.1rem"
                      sx={{ marginLeft: 1 }}
                    >
                      {verseKey}:
                    </Typography>
                    {Object.keys(textSection[chapterKey][verseKey]).map(
                      (wordIndex) => {
                        const word =
                          textSection[chapterKey][verseKey][wordIndex];
                        const isHighlighted =
                          highlightedWord &&
                          highlightedWord.chapter === chapterKey &&
                          highlightedWord.verse === verseKey &&
                          highlightedWord.word === parseInt(wordIndex);

                        return (
                          <Box
                            component="span"
                            key={wordIndex}
                            onClick={() => handleWordClick(word.time)}
                            sx={{
                              mx: 0.5,
                              display: "inline-block",
                              maxWidth: "100%",
                            }}
                          >
                            {renderWord(
                              isTorahFontEnabled
                                ? word.none
                                : version === "both"
                                ? word.both
                                : version === "nikud"
                                ? word.nikud
                                : version === "teamim"
                                ? word.teamim
                                : word.none,
                              isHighlighted!
                            )}
                          </Box>
                        );
                      }
                    )}
                  </Box>
                ))}
              </Box>
            ))}
          </Typography>
        </Box>
      </TextContainer>
      <Box mt={2}>
        <VersionSelector
          onVersionChange={handleVersionChange}
          onTorahFontChange={handleTorahFontChange}
        />
      </Box>
    </Container>
  );
};

export default DisplayText;
