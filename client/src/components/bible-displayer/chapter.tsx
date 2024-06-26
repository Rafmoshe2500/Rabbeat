import Verse from "./verse";

type ChapterProps = {
  chapterKey: string;
  chapter: Chapter;
  wordToMark?: WordToMark;
};

const Chapter = ({ chapterKey, chapter, wordToMark }: ChapterProps) => {
  return (
    <div>
      <h3>פרק {chapterKey}</h3>
      {Object.entries(chapter).map(([verseKey, verse]) => (
        <Verse
          key={verseKey}
          verseKey={verseKey}
          verse={verse}
          wordToMark={verseKey === wordToMark?.verse ? wordToMark : undefined}
        />
      ))}
    </div>
  );
};

export default Chapter;
