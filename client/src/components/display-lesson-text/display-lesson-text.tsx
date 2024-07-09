import { useState } from "react";
import VersionSelector from "../text-version-selector/text-version-selector";
import { Button } from "@mui/material";

interface DisplayTextProps {
  text: TextSection;
  highlightedWord?: WordToMark;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

const DisplayText: React.FC<DisplayTextProps> = ({
  text: textSection,
  highlightedWord,
  audioRef,
}) => {
  const [version, setVersion] = useState<Version>("none");
  const [isTorahFontEnable, setIsTorahFontEnable] = useState<boolean>(false);

  const handleTorahFontClicked = () => {
    setIsTorahFontEnable((prev) => !prev);
  };

  const handleVersionChange = (newVersion: Version) => {
    setVersion(newVersion);
  };

  const handleWordClick = (timestamp: number) => {
    if (audioRef?.current) {
      audioRef.current.currentTime = timestamp;
      audioRef.current.play();
    }
  };

  return (
    <div>
      <div>
        <VersionSelector onVersionChange={handleVersionChange} />
        <Button
          sx={{
            color: "black",
            border: "solid 1px black",
            backgroundColor: "white",
          }}
          onClick={handleTorahFontClicked}
        >
          תורה אמיתית
        </Button>
      </div>
      <div className={isTorahFontEnable ? "stam-font" : ""}>
        {Object.keys(textSection).map((chapterKey) => (
          <div key={chapterKey}>
            <h3>פרק {chapterKey}</h3>
            {Object.keys(textSection[chapterKey]).map((verseKey) => (
              <div key={verseKey}>
                <span style={{ fontWeight: "bold" }}>{verseKey}:</span>
                {Object.keys(textSection[chapterKey][verseKey]).map(
                  (wordIndex) => {
                    const word = textSection[chapterKey][verseKey][wordIndex];
                    const isHighlighted =
                      highlightedWord &&
                      highlightedWord.chapter === chapterKey &&
                      highlightedWord.verse === verseKey &&
                      highlightedWord.word === parseInt(wordIndex);

                    return (
                      <span
                        key={wordIndex}
                        onClick={() => handleWordClick(word.time)}
                        style={{
                          backgroundColor: isHighlighted
                            ? "yellow"
                            : "transparent",
                        }}
                      >
                        {version === "both"
                          ? word.both
                          : version === "nikud"
                          ? word.nikud
                          : version === "teamim"
                          ? word.teamim
                          : word.none}{" "}
                      </span>
                    );
                  }
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayText;
