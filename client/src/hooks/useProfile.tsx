import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getProfile, updateProfile} from '../api/endpoints/profile'

export const useGetProfile = (id: string | undefined) => {
    return useQuery({
      queryKey: ['profile', id],
      queryFn: () => getProfile(id!),
      enabled: !!id,
    });
  };

  export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (updateData: updateProfile) => updateProfile(updateData),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['profile', variables.id] });
      },
    });
  };