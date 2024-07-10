import { useQuery } from '@tanstack/react-query';
import { getProfile} from '../api/endpoints/profile'

export const useGetProfile = (id: string | undefined) => {
    return useQuery({
      queryKey: ['profile', id],
      queryFn: () => getProfile(id!),
      enabled: !!id,
    });
  };