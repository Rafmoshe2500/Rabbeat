type FormattedLesson = LessonDetails & FormattedLessonContent;

type FormattedLessonContent = {
  audio: string;
  highlightsTimestamps?: Array<number>;
  text?: TextSection;
};

type LessonContent = {
  audio: Blob;
  highlightsTimestamps?: Array<number>;
  text?: TextSection;
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
};

type LessonDetailsWIthStatus = LessonDetails & {
  status: LessonStatus;
};

type LessonVersion = "Spanish" | "Ashkenaz";
