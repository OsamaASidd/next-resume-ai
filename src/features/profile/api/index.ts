import { client } from '@/lib/client';
import { ProfileFormValues } from '../utils/form-schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const response = await client.profile.getProfiles.$get();
      return response.json();
    }
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const response = await client.profile.createProfile.$post(data);
      return response.json();
    },
    onSettled: () => {
      // Invalidate and refetch profiles after successful submission
      queryClient.invalidateQueries({
        queryKey: ['profiles']
      });
    }
  });
};

// export const useUpdateProfile = () => {
//   return useMutation({
//     mutationFn: async ({
//       id,
//       data
//     }: {
//       id: string;
//       data: ProfileFormValues;
//     }) => {
//       const response = await client.profile.updateProfile.$post(data);
//       return response.json();
//     },
//     onSuccess: () => {
//       toast.success('Profile updated successfully');
//     },
//     onError: (error) => {
//       toast.error('Failed to update profile');
//     }
//   });
// };
