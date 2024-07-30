const flattenTorahSection = (
  torahSection: TorahSection
): { chapter: string; verse: string; word: string }[] => {
  const flattened: { chapter: string; verse: string; word: string }[] = [];

  for (const chapterKey in torahSection) {
    const chapter = torahSection[chapterKey];
    for (const verseKey in chapter) {
      const verse = chapter[verseKey];
      const words = verse.split(" ");

      for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
        flattened.push({
          chapter: chapterKey,
          verse: verseKey,
          word: words[wordIndex],
        });
      }
    }
  }

  return flattened;
};

export const findWord = (torahSection: TorahSection, length: number) => {
  const flattened = flattenTorahSection(torahSection);

  let wordCount = 0;
  let wordOccurrenceMap: { [key: string]: number } = {};

  for (const { chapter, verse, word } of flattened) {
    const verseWords = torahSection[chapter][verse].split(" ");

    if (!wordOccurrenceMap[`${chapter}-${verse}-${word}`]) {
      wordOccurrenceMap[`${chapter}-${verse}-${word}`] = 0;
    }

    wordOccurrenceMap[`${chapter}-${verse}-${word}`]++;
    wordCount++;

    if (wordCount === length) {
      const occurrence = wordOccurrenceMap[`${chapter}-${verse}-${word}`];
      let currentOccurrence = 0;

      for (let wordIndex = 0; wordIndex < verseWords.length; wordIndex++) {
        if (verseWords[wordIndex] === word) {
          currentOccurrence++;
        }

        if (currentOccurrence === occurrence) {
          return { chapter, verse, word: wordIndex };
        }
      }
    }
  }
};

export const lessonStatusMapper: Record<LessonStatus, string> = {
  "not-started": "טרם התחיל",
  "in-progress": "בתהליך לימוד",
  finished: "הסתיים",
};

export const lessonVersionsMapper: Record<LessonVersion, string> = {
  Ashkenaz: "אשכנזי",
  Jerusalemite: "ירושלמי",
  Moroccan: "מרוקאי",
  Yemeni: "תימני",
};
