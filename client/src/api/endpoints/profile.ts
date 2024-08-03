import apiClient from "../config";

export const getProfile = async (id: string): Promise<teacherProfile> => {
    if (!id) throw new Error("Profile ID is required");
    const response = await apiClient.get<teacherProfile>(`/profile/${id}`);
    return response.data;
  };


  export const updateProfile = async (updateData: updateProfile): Promise<teacherProfile> => {
    const response = await apiClient.post<teacherProfile>(`/profile/${updateData.id}`, {
      'key': updateData.key,
      'value': updateData.value,
    });
    return response.data;
  };

  export const getAllTeachers = async (): Promise<teacherProfile[]> => {
    const response = await apiClient.get(`/teachers`);
    return response.data;
  };
  
  export const getConnection = async (studentId:string, teacherId: string): Promise<boolean> => {
    const response = await apiClient.get(`/is-connection/student/${studentId}/teacher/${teacherId}`);
    return response.data;
  };
  
  export const createSample = async (newSample: NewSample) => {
    const response = await apiClient.post('/profile/sample', newSample);
    return response.data;
  };
  
  export const deleteSample = async (sampleId: string) => {
    await apiClient.delete(`/profile/sample`, { data: { sampleId } });
  };

  export const getSamples = async (teacherId: string) => {
    const response = await apiClient.get(`/profile/${teacherId}/samples`, { data: { teacherId } });
    return response.data
  }; 