'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Profile() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateUserProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [socialLinks, setSocialLinks] = useState(user?.socialLinks || []);
  const [preferences, setPreferences] = useState(user?.preferences || {});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  const handleUpdateProfile = async () => {
    if (!user._id) return;

    await updateProfile({
      userId: user._id,
      bio,
      socialLinks,
      preferences,
    });

    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {user.image && (
              <img
                src={user.image}
                alt={user.name}
                className="w-20 h-20 rounded-full"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">About Me</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-gray-800 text-white p-4 rounded-lg"
                rows={4}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-300">{bio || 'No bio yet'}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <button
                onClick={handleUpdateProfile}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Activity</h2>
            <p className="text-gray-400">Last login: {new Date(user.lastLogin || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
