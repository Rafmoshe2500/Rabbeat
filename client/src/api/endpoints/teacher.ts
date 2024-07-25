import apiClient from "../config";

export const fetchStudents = async (teacherId: string): Promise<Student[]> => {
  const response = await apiClient.get(`/all-students/${teacherId}`);
  return response.data;
};

export const associateStudentToTeacher = async (data: AssociateNewStudent) => {
  const response = await apiClient.post('/teacher/new-student', data);
  return response.data;
};

export const searchStudentByEmail = async (email: string) => {
  const response = await apiClient.get(`/students/search?email=${encodeURIComponent(email)}`);
  return response.data;
};