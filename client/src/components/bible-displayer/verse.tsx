const Verse: React.FC<{ verseKey: string; verse: Verse }> = ({
  verseKey,
  verse,
}) => {
  return (
    <div>
      <strong>{verseKey}:</strong> {verse}
    </div>
  );
};

export default Verse;
