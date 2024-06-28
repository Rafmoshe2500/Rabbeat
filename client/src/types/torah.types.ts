type Verse = string;

type Chapter = {
  [verse: string]: Verse;
};

type TorahSection = {
  [chapter: string]: Chapter;
};

type TorahSections = {
  both: TorahSection;
  none: TorahSection;
  nikud: TorahSection;
  teamim: TorahSection;
};

type Version = "none" | "nikud" | "teamim" | "both";

type TextVersion = {
  time: number;
  both: string;
  none: string;
  nikud: string;
  teamim: string;
};

type DetailedVerse = {
  [wordIndex: string]: TextVersion;
};

type DetailedChapter = {
  [verseIndex: string]: DetailedVerse;
};

type TextSection = {
  [chapterIndex: string]: DetailedChapter;
};
