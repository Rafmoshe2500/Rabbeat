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
        creationDate: les.metadata.creationDate,
        version: "Ashkenaz",
        pentateuch: les.metadata.pentateuch,
        endChapter: les.metadata.endChapter,
        endVers: les.metadata.endVers,
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

export const getLessonsById = async (lessonId: string): Promise<Lesson> => {
  try {
    const response = await apiClient.get<FormattedLesson>(
      `/lessons/${lessonId}`
    );
    const audio = convertBase64ToBlob(response.data.audio);
    const lesson: Lesson = { ...response.data, audio };
    return lesson;
  } catch (error) {
    throw error;
  }
};

export const createOrUpdateLesson = async (
  lesson: FormattedLesson
): Promise<FormattedLesson> => {
  try {
    const a = {
      audio: lesson.audio,
      highlightsTimestamps: lesson.highlightsTimestamps,
      metadata: {
        title: lesson.title,
        startChapter: lesson.startChapter,
        startVerse: lesson.startVerse,
        endChapter: lesson.endChapter,
        endVers: lesson.endVers,
        pentateuch: lesson.pentateuch,
        creationDate: lesson.creationDate,
      },
    };
    const response = await apiClient.post<FormattedLesson>("/lesson", a);
    console.log(a);

    return response.data as FormattedLesson;
  } catch (error) {
    throw error;
  }
};
