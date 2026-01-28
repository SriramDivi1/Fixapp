import React, { useRef, useState, ChangeEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUploadProfileImage } from '../hooks/useUploadProfileImage';
import { assets } from '../assets/assets';

const MyProfile: React.FC = () => {
  const { profile, user, loading } = useAuth();
  const { upload, isUploading } = useUploadProfileImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    upload(file, {
      onSuccess: () => {
        setPreviewUrl(null); // Clear preview after successful upload
      },
      onError: () => {
        setPreviewUrl(null); // Clear preview on error
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-start gap-6 mb-6">
          {/* Profile Picture with Upload */}
          <div className="relative">
            <img
              src={previewUrl || profile.profile_image_url || '/fallback-user.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
            
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Change profile picture"
            >
              <img src={assets.upload_icon} alt="Upload" className="w-4 h-4 invert" />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{profile.full_name}</h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-500 capitalize mt-1">Role: {profile.role}</p>
            
            {isUploading && (
              <p className="text-sm text-primary mt-2 animate-pulse">
                Uploading profile picture...
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <p className="text-gray-900">{profile.phone_number || 'Not provided'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <p className="text-gray-900">
              {profile.date_of_birth
                ? new Date(profile.date_of_birth).toLocaleDateString()
                : 'Not provided'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <p className="text-gray-900 capitalize">{profile.gender || 'Not provided'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
            <p className="text-gray-900">
              {profile.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        </div>

        {profile.address && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <p className="text-gray-900">{profile.address}</p>
          </div>
        )}

        {/* TODO: Add edit profile functionality */}
        <div className="mt-8 flex gap-4">
          <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Edit Profile
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="border border-primary text-primary px-6 py-2 rounded-md hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Change Photo
          </button>
        </div>
      </div>

      {/* Upload Tips */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">📸 Photo Upload Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Maximum file size: 5MB (images will be compressed automatically)</li>
          <li>• Supported formats: JPEG, PNG, WebP</li>
          <li>• Recommended: Square photos work best</li>
          <li>• Your photo will be resized to 1024px for optimal performance</li>
        </ul>
      </div>
    </div>
  );
};

export default MyProfile;
