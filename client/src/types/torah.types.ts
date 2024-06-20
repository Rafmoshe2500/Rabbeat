type Verse = string;

interface Chapter {
  [verse: string]: Verse;
}

type TorahSection = {
  [chapter: string]: Chapter;
};

// type TorahSection = {
//   [book: string]: Pentateuch;
// };
