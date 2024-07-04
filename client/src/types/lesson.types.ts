type FormattedLesson = LessonDetails & FormattedLessonContent;

type FormattedLessonContent = {
  audio: string;
  highlightsTimestamps?: Array<number>;
  text?: TextSection;
  sttText: string;
};

type LessonContent = {
  audio: Blob;
  highlightsTimestamps?: Array<number>;
  text?: TextSection;
  sttText: string;
};

type Lesson = LessonDetails & LessonContent;

const lessonStatus = ["not-started", "in-progress", "finished"] as const;

type LessonStatus = (typeof lessonStatus)[number];

type LessonDetails = {
  id?: string;
  title: string;
  startChapter: string;
  startVerse: string;
  endChapter: string;
  endVerse: string;
  pentateuch: string;
  version: LessonVersion;
  creationDate: string;
  status?: LessonStatus;
};

type LessonVersion = "Spanish" | "Ashkenaz";
