import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/database';
import { handleSupabaseError } from '@/utils/handleSupabaseError';
import { toast } from 'react-toastify';

interface UpdateProfileParams {
  full_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  profile_image_url?: string;
}

/**
 * Hook to update user profile
 * 
 * Automatically invalidates auth state to trigger UI updates
 * 
 * @example
 * ```tsx
 * const { mutate: updateProfile, isLoading } = useUpdateProfile();
 * 
 * updateProfile({
 *   full_name: 'John Doe',
 *   phone_number: '+911234567890'
 * });
 * ```
 */
export const useUpdateProfile = (): UseMutationResult<
  UserProfile,
  Error,
  UpdateProfileParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: UpdateProfileParams) => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to update your profile');
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        handleSupabaseError(error);
        throw error;
      }

      return data as UserProfile;
    },
    onSuccess: () => {
      // Invalidate auth-related queries to refresh profile data
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
};
