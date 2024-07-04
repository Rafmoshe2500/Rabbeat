import apiClient from "../config";

export const getLessonNotes = async (
  userId: string,
  lessonId: string
): Promise<Note[]> => {
  try {
    const response = await apiClient.get<Note[]>(
      `/lesson-comments/${lessonId}/user/${userId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNote = async (note: Omit<Note, "id">): Promise<Note> => {
  try {
    const response = await apiClient.post<Note>("/lesson-comment", note);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateNote = async (note: Note): Promise<Note> => {
  try {
    const response = await apiClient.post<Note>(
      `/lesson-comment/${note.id}`,
      note
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNote = async (noteId: string): Promise<boolean> => {
  try {
    const response = await apiClient.delete<boolean>(
      `/lesson-comment/${noteId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
