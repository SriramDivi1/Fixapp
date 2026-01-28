import { supabase } from '@/lib/supabase';

/**
 * Upload options for image compression
 */
export interface UploadOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  quality?: number;
}

/**
 * Compress an image file using browser-native Canvas API
 * 
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Compressed image file
 */
export async function compressImage(
  file: File,
  options: UploadOptions = {}
): Promise<File> {
  const {
    maxSizeMB = 1,
    maxWidthOrHeight = 1920,
    quality = 0.8,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidthOrHeight) {
            height = (height * maxWidthOrHeight) / width;
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width = (width * maxWidthOrHeight) / height;
            height = maxWidthOrHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            // Check if compressed size is within limit
            const sizeMB = blob.size / 1024 / 1024;
            if (sizeMB > maxSizeMB) {
              // Try again with lower quality
              canvas.toBlob(
                (retryBlob) => {
                  if (!retryBlob) {
                    reject(new Error('Image too large even after compression'));
                    return;
                  }
                  
                  const compressedFile = new File(
                    [retryBlob],
                    file.name,
                    { type: 'image/jpeg' }
                  );
                  resolve(compressedFile);
                },
                'image/jpeg',
                quality * 0.7 // More aggressive compression
              );
            } else {
              const compressedFile = new File(
                [blob],
                file.name,
                { type: 'image/jpeg' }
              );
              resolve(compressedFile);
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const prefix = type.slice(0, -2);
      return file.type.startsWith(prefix);
    }
    return file.type === type;
  });
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const sizeMB = file.size / 1024 / 1024;
  return sizeMB <= maxSizeMB;
}

/**
 * Upload a file to Supabase Storage
 * 
 * @param file - File to upload
 * @param bucket - Storage bucket name
 * @param path - File path within bucket
 * @returns Public URL of uploaded file
 */
export async function uploadToStorage(
  file: File,
  bucket: string,
  path: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true, // Replace if exists
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error(error.message || 'Failed to upload file');
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFromStorage(
  bucket: string,
  path: string
): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    throw new Error(error.message || 'Failed to delete file');
  }
}

/**
 * Generate a unique file path for user uploads
 */
export function generateFilePath(userId: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${userId}/${timestamp}_${sanitizedName}`;
}
