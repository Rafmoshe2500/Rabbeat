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

// Function to find the location of a word based on a given length
export const findWord = (
  torahSection: TorahSection,
  length: number
): { chapter: string; verse: string; word: number } | null => {
  const flattened = flattenTorahSection(torahSection);

  let wordCount = 0;
  for (const { chapter, verse, word } of flattened) {
    wordCount++;

    if (wordCount === length) {
      const verseWords = torahSection[chapter][verse].split(" ");
      const wordIndex = verseWords.indexOf(word);
      return { chapter, verse, word: wordIndex };
    }
  }

  return null;
};
