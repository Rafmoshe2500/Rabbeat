import apiClient from "../config";

export const getProfile = async (id: string): Promise<teacherProfile> => {
    if (!id) throw new Error("Profile ID is required");
    const response = await apiClient.get<teacherProfile>(`/profile/${id}`);
    console.log(response.data)
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
  