import { convertBase64ToBlob } from "../../utils/audio-parser";
import apiClient from "../config";

export const getAllLessons = async (): Promise<Lesson[]> => {
  try {
    const response = await apiClient.get<Lesson[]>("/lessons");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllLessonsDetails = async (): Promise<LessonDetails[]> => {
  try {
    const response = await apiClient.get<LessonDetails[]>("/lessons-metadata");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLessonsDetailsByUser = async (
  userId: string
): Promise<LessonDetails[]> => {
  try {
    const response = await apiClient.get<LessonDetails[]>(`/lessons/${userId}`);
    const lessons: LessonDetails[] = [];

    for (let i = 0; i < Object.entries(response.data).length; i++) {
      const les = Object.values(response.data)[i] as unknown as any;

      lessons.push({
        id: les.lessonId,
        creationDate: les.metadata.creationDate,
        version: les.metadata.version,
        pentateuch: les.metadata.pentateuch,
        endChapter: les.metadata.endChapter,
        endVerse: les.metadata.endVerse,
        startChapter: les.metadata.startChapter,
        startVerse: les.metadata.startVerse,
        title: les.metadata.title,
      } as LessonDetails);
    }

    return lessons;
  } catch (error) {
    throw error;
  }
};

export const getLessonsById = async (
  lessonId: string
): Promise<LessonContent> => {
  try {
    const response = await apiClient.get<FormattedLessonContent>(
      `/lesson/${lessonId}`
    );
    const { audio, highlightsTimestamps, text, sttText } = response.data;

    return {
      audio: convertBase64ToBlob(audio),
      highlightsTimestamps,
      text,
      sttText,
    };
  } catch (error) {
    throw error;
  }
};

export const createOrUpdateLesson = async (
  lesson: FormattedLesson
): Promise<FormattedLesson> => {
  try {
    const dbLesson = {
      audio: lesson.audio,
      highlightsTimestamps: lesson.highlightsTimestamps,
      sttText: lesson.sttText,
      metadata: {
        title: lesson.title,
        startChapter: lesson.startChapter,
        startVerse: lesson.startVerse,
        endChapter: lesson.endChapter,
        endVerse: lesson.endVerse,
        pentateuch: lesson.pentateuch,
        creationDate: lesson.creationDate,
        version: lesson.version,
      },
    };
    const response = await apiClient.post<FormattedLesson>("/lesson", dbLesson);

    return response.data as FormattedLesson;
  } catch (error) {
    throw error;
  }
};
