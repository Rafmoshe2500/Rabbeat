type FormattedLesson = {
  text: string;
  audioInBase64: string;
  highlightsTimestamps?: Array<number>;
};

type Lesson = {
  title: string,
  version: LessonVersion,
  startChapter: string,
  startVerse: string,
  endChapter: string,
  endVers: string,
  pentateuch: string,
  audio: Blob;
  highlightsTimestamps?: Array<number>;
};

type LessonForView = Lesson & {
  text: string
};

const lessonStatus = ["not-started", "in-progress", "finished"] as const;

type LessonStatus = (typeof lessonStatus)[number];

type LessonDetails = {
  name: string;
  id: string;
  status: LessonStatus;
};

type LessonVersion = "Spanish" | "Ashkenaz";
