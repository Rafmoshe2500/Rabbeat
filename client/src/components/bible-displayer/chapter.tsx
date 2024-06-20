import Verse from "./verse";

const Chapter: React.FC<{ chapterKey: string; chapter: Chapter }> = ({
  chapterKey,
  chapter,
}) => {
  return (
    <div>
      <h3>פרק {chapterKey}</h3>
      {Object.entries(chapter).map(([verseKey, verse]) => (
        <Verse key={verseKey} verseKey={verseKey} verse={verse} />
      ))}
    </div>
  );
};

export default Chapter;
