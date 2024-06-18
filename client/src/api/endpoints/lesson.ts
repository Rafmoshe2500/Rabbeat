import apiClient from '../config';

export const getAllLessons = async (): Promise<Lesson[]> => {
  try {
    const response = await apiClient.get<Lesson[]>('/lessons');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLessonsByUser = async (userId: string): Promise<Lesson[]> => {
  try {
    const response = await apiClient.get<Lesson[]>(`/users/${userId}/lessons`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrUpdateLesson = async (lesson: Lesson): Promise<Lesson> => {
  try {
    const response = await apiClient.post<Lesson>('/lessons', lesson);
    return response.data;
  } catch (error) {
    throw error;
  }
};
