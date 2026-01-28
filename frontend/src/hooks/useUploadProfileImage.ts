import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
  compressImage,
  uploadToStorage,
  validateFileType,
  validateFileSize,
  generateFilePath,
} from '@/utils/uploadImage';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-toastify';

interface UploadProfileImageOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for uploading profile images to Supabase Storage
 * 
 * Features:
 * - Client-side image compression
 * - File validation (type and size)
 * - Automatic profile update in database
 * - Optimistic UI updates
 * - Progress tracking (future enhancement)
 * 
 * @example
 * ```tsx
 * function ProfileUpload() {
 *   const { upload, isUploading } = useUploadProfileImage();
 *   
 *   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
 *     const file = e.target.files?.[0];
 *     if (file) upload(file);
 *   };
 *   
 *   return (
 *     <input type="file" onChange={handleFileChange} disabled={isUploading} />
 *   );
 * }
 * ```
 */
export const useUploadProfileImage = (options?: UploadProfileImageOptions) => {
  const { user, profile, refreshAuth } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user) {
        throw new Error('You must be logged in to upload images');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validateFileType(file, allowedTypes)) {
        throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
      }

      // Validate file size (5MB before compression)
      if (!validateFileSize(file, 5)) {
        throw new Error('File size must be less than 5MB');
      }

      // Compress image
      toast.info('Compressing image...');
      const compressedFile = await compressImage(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        quality: 0.8,
      });

      // Generate unique file path
      const filePath = generateFilePath(user.id, file.name);

      // Upload to Supabase Storage
      toast.info('Uploading...');
      const publicUrl = await uploadToStorage('avatars', filePath, compressedFile);

      // Update user profile in database
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ profile_image_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw new Error(updateError.message || 'Failed to update profile');
      }

      return publicUrl;
    },
    onSuccess: (url) => {
      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      // Refresh auth state to get updated profile
      refreshAuth();

      toast.success('Profile picture updated successfully!');
      
      if (options?.onSuccess) {
        options.onSuccess(url);
      }
    },
    onError: (error: Error) => {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload profile picture');
      
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  return {
    upload: mutation.mutate,
    isUploading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};

/**
 * Hook for uploading doctor profile images
 * Similar to useUploadProfileImage but updates doctor table
 */
export const useUploadDoctorImage = (options?: UploadProfileImageOptions) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user) {
        throw new Error('You must be logged in to upload images');
      }

      // Validate
      if (!validateFileType(file, ['image/jpeg', 'image/png', 'image/webp'])) {
        throw new Error('Invalid file type');
      }

      if (!validateFileSize(file, 5)) {
        throw new Error('File too large (max 5MB)');
      }

      // Compress and upload
      const compressedFile = await compressImage(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        quality: 0.8,
      });

      const filePath = generateFilePath(user.id, file.name);
      const publicUrl = await uploadToStorage('avatars', filePath, compressedFile);

      // Update doctor profile
      const { error: updateError } = await supabase
        .from('doctors')
        .update({ profile_image_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) {
        throw new Error(updateError.message || 'Failed to update doctor profile');
      }

      return publicUrl;
    },
    onSuccess: (url) => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor profile picture updated!');
      
      if (options?.onSuccess) {
        options.onSuccess(url);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Upload failed');
      
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  return {
    upload: mutation.mutate,
    isUploading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};
