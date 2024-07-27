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

export const getLessonsDetailsByUser = async (
  userId: string
): Promise<LessonDetails[]> => {
  try {
    const response = await apiClient.get<LessonDetails[] | LessonDetails>(
      `/lesson-details/${userId}`
    );
    const lessons: LessonDetails[] = [];

    for (let i = 0; i < Object.entries(response.data).length; i++) {
      const les = Object.values(response.data)[i] as unknown as any;
      const { chatId, status, testAudioId } = les.studyZoneDetails || {};
      lessons.push({
        id: les.lessonId,
        creationDate: les.details.creationDate,
        version: les.details.version,
        pentateuch: les.details.pentateuch,
        endChapter: les.details.endChapter,
        endVerse: les.details.endVerse,
        startChapter: les.details.startChapter,
        startVerse: les.details.startVerse,
        title: les.details.title,
        status: status,
        chatId: chatId,
        testAudioId: testAudioId,
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
  lesson: FormattedLesson,
  teacherId: string
): Promise<FormattedLesson> => {
  try {
    const dbLesson = {
      audio: lesson.audio,
      highlightsTimestamps: lesson.highlightsTimestamps,
      sttText: lesson.sttText,
      details: {
        title: lesson.title,
        startChapter: lesson.startChapter,
        startVerse: lesson.startVerse,
        endChapter: lesson.endChapter,
        endVerse: lesson.endVerse,
        pentateuch: lesson.pentateuch,
        creationDate: lesson.creationDate,
        version: lesson.version,
      },
      teacherId: teacherId,
    };
    const response = await apiClient.post<FormattedLesson>("/lesson", dbLesson);

    return response.data as FormattedLesson;
  } catch (error) {
    throw error;
  }
};

export const getSharedLessonsDetails = async (
  teacherId: string,
  studentId: string
): Promise<LessonDetails[]> => {
  try {
    const response = await apiClient.get<LessonDetails[]>(
      `/teacher/${teacherId}/student/${studentId}/lessons`
    );
    const lessons: LessonDetails[] = [];

    for (let i = 0; i < Object.entries(response.data).length; i++) {
      const les = Object.values(response.data)[i] as unknown as any;
      const { chatId, status, testAudioId } = les.studyZoneDetails;
      lessons.push({
        id: les.lessonId,
        creationDate: les.details.creationDate,
        version: les.details.version,
        pentateuch: les.details.pentateuch,
        endChapter: les.details.endChapter,
        endVerse: les.details.endVerse,
        startChapter: les.details.startChapter,
        startVerse: les.details.startVerse,
        title: les.details.title,
        status: status,
        chatId: chatId,
        testAudioId: testAudioId,
      } as LessonDetails);
    }

    return lessons;
  } catch (error) {
    throw error;
  }
};

export const associateLesson = async (studentId: string, teacherId: string, lessonId: string): Promise<string> => {
  const response = await apiClient.post('/associate-lesson', { studentId, teacherId, lessonId });
  return response.data;
};

export const disassociateLesson = async (lessonId: string, studentId: string): Promise<string> => {
  const response = await apiClient.delete('/disassociate-lesson', { data: { lessonId, studentId } });
  return response.data;
};

export const updateLessonStatus = async (
  lessonId: string,
  userId: string,
  newStatus: LessonStatus
): Promise<Boolean> => {
  try {
    const response = await apiClient.put<LessonStatus>(`/lesson-status`, {
      lessonId,
      userId,
      status: newStatus,
    });

    return response.data ? true : false;
  } catch (error) {
    throw error;
  }
};
