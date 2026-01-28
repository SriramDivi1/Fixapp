import React from 'react';
import { useAuth } from '../hooks/useAuth';

const MyProfile: React.FC = () => {
  const { profile, user, loading } = useAuth();

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
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-6 mb-6">
          <img
            src={profile.profile_image_url || '/fallback-user.png'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold">{profile.full_name}</h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-500 capitalize">Role: {profile.role}</p>
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
              {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {profile.address && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <p className="text-gray-900">{profile.address}</p>
          </div>
        )}

        {/* TODO: Add edit profile functionality in Phase 3 */}
        <div className="mt-8">
          <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
