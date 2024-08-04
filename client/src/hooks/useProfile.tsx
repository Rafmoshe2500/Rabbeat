import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getProfile, updateProfile, getAllTeachers, getConnection, createSample, deleteSample, getSamples } from '../api/endpoints/profile'

export const useGetProfile = (id: string | undefined) => {
    return useQuery({
      queryKey: ['profile', id],
      queryFn: () => getProfile(id!),
      enabled: !!id,
    });
  };

  export const useGetConnection = (studentId: string | undefined , teacherId: string) => {
    return useQuery({
      queryKey: ['id', teacherId],
      queryFn: () => getConnection(studentId!, teacherId),
    });
  };


  export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (updateData: updateProfile) => updateProfile(updateData),
      onSuccess: (variables) => {
        queryClient.invalidateQueries({ queryKey: ['profile', variables.id] });
      },
      onError: (error) => {
        console.error('Profile update failed:', error);
      },
    });
  };



  export const useGetAllTeachers = () => {
    return useQuery<teacherProfile[], Error>({
      queryKey: ['teachers'],
      queryFn: getAllTeachers
    });
  };

  export const useSamples = (teacherId: string) => {
    const queryClient = useQueryClient();
  
    const createSampleMutation = useMutation({
      mutationFn: (newSample: NewSample) => createSample(newSample),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile', teacherId] });
      },
    });
  
    const deleteSampleMutation = useMutation({
      mutationFn: (sampleId: string) => deleteSample(sampleId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile', teacherId] });
      },
    });
    
    const getSamplesMutation = useMutation({
      mutationFn: () => getSamples(teacherId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile', teacherId] });
      },
    });
  
    return {
      createSample: createSampleMutation.mutate,
      deleteSample: deleteSampleMutation.mutate,
      getSamples: getSamplesMutation.mutate,
      isCreating: createSampleMutation.isPending,
      isDeleting: deleteSampleMutation.isPending,
    };
};