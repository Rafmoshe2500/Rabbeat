import styles from "./verse.module.css";

type VerseProps = {
  verseKey: string;
  verse: Verse;
  wordToMark?: WordToMark;
};

const Verse = ({ verseKey, verse, wordToMark }: VerseProps) => {
  const words = verse.split(" ");

  return (
    <div>
      <strong>{verseKey}: </strong>
      {words.map((word, index) => (
        <span
          key={index}
          className={index === wordToMark?.word ? styles["highlight"] : ""}
        >
          {word}{" "}
        </span>
      ))}

      {/* <strong>{verseKey}:</strong> {verse} */}
    </div>
  );
};

export default Verse;
