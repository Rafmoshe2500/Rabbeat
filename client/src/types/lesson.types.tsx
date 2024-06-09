type FormattedLesson = {
  text: string;
  audioInBase64: string;
  highlightsTimestamps?: Array<number>;
};

type Lesson = {
  text: string;
  audio: Blob;
  highlightsTimestamps?: Array<number>;
};

const lessonStatus = ["not-started", "in-progress", "finished"] as const;

type LessonStatus = (typeof lessonStatus)[number];

type LessonDetails = {
  name: string;
  id: string;
  status: LessonStatus;
};
