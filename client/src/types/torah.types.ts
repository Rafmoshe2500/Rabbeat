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
