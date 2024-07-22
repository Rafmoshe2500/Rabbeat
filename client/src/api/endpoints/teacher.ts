import apiClient from "../config";

export const fetchStudents = async (teacherId: string): Promise<Student[]> => {
    const response = await apiClient.get(`/all-students/${teacherId}`);
    return response.data;
  };