type FormattedLesson = LessonDetails & {
  audio: string;
  highlightsTimestamps?: Array<number>;
};

type Lesson = LessonDetails & {
  audio: Blob;
  highlightsTimestamps?: Array<number>;
};

type LessonForView = Lesson & {
  text: TorahSection;
};

const lessonStatus = ["not-started", "in-progress", "finished"] as const;

type LessonStatus = (typeof lessonStatus)[number];

type LessonDetails = {
  title: string;
  startChapter: string;
  startVerse: string;
  endChapter: string;
  endVers: string;
  pentateuch: string;
  version: LessonVersion;
  creationDate: string;
};

type LessonDetailsWIthStatus = LessonDetails & {
  status: LessonStatus;
};

type LessonVersion = "Spanish" | "Ashkenaz";
