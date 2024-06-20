type Verse = string;

interface Chapter {
  [verse: string]: Verse;
}

type TorahSection = {
  [chapter: string]: Chapter;
};
