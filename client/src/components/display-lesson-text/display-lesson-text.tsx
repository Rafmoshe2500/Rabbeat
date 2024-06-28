import { useState } from "react";
import VersionSelector from "../text-version-selector/text-version-selector";
import { Button } from "@mui/material";

interface DisplayTextProps {
  text: TextSection;
  highlightedWord?: WordToMark;
}

const DisplayText: React.FC<DisplayTextProps> = ({
  text: textSection,
  highlightedWord,
}) => {
  const [version, setVersion] = useState<Version>("none");
  const [isTorahFontEnable, setIsTorahFontEnable] = useState<boolean>(false);

  const handleTorahFontClicked = () => {
    setIsTorahFontEnable((prev) => !prev);
  };

  const handleVersionChange = (newVersion: Version) => {
    setVersion(newVersion);
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
            <h3>Chapter {chapterKey}</h3>
            {Object.keys(textSection[chapterKey]).map((verseKey) => (
              <div key={verseKey}>
                <p>Verse {verseKey}:</p>
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
