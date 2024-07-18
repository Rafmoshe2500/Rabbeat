import { useState } from "react";
import VersionSelector from "../text-version-selector/text-version-selector";
import styles from "./display-lesson-text.module.css";

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
  const [isTorahFontEnabled, setIsTorahFontEnabled] = useState<boolean>(false);

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

  return (
    <div>
      <div
        className={`${styles["container"]} ${
          isTorahFontEnabled ? "stam-font" : ""
        }`}
      >
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
                        {isTorahFontEnabled
                          ? word.none
                          : version === "both"
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
      <div>
        <VersionSelector
          onVersionChange={handleVersionChange}
          onTorahFontChange={handleTorahFontChange}
        />
      </div>
    </div>
  );
};

export default DisplayText;
