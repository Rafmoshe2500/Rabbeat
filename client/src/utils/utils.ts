export const getWrongWords = (text: string, targetText: string) => {
  const splittedText = text.split(" ");
  const splittedTargetText = targetText.split(" ");
  let results: Array<Word> = [];

  const length =
    splittedTargetText.length > splittedText.length
      ? splittedText.length
      : splittedTargetText.length;

  for (let i = 0; i < length; i++) {
    results.push({
      text: splittedTargetText[i],
      isCorrect: splittedText[i] === splittedTargetText[i],
    });
  }

  return results;
};

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