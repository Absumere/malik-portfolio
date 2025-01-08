'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '@/context/AuthContext';

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
    router.push('/sign-in');
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

  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/5 rounded-lg p-8 backdrop-blur-xl border border-white/10">
          <div className="flex items-center space-x-4 mb-8">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-2xl">{user.name[0]}</span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-white"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Social Links
                </label>
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      value={link.platform}
                      onChange={(e) =>
                        setSocialLinks(
                          socialLinks.map((l, i) =>
                            i === index ? { ...l, platform: e.target.value } : l
                          )
                        )
                      }
                      className="flex-1 bg-black/50 border border-white/10 rounded-md p-2 text-white"
                      placeholder="Platform"
                    />
                    <input
                      value={link.url}
                      onChange={(e) =>
                        setSocialLinks(
                          socialLinks.map((l, i) =>
                            i === index ? { ...l, url: e.target.value } : l
                          )
                        )
                      }
                      className="flex-2 bg-black/50 border border-white/10 rounded-md p-2 text-white"
                      placeholder="URL"
                    />
                    <button
                      onClick={() =>
                        setSocialLinks(socialLinks.filter((_, i) => i !== index))
                      }
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setSocialLinks([...socialLinks, { platform: '', url: '' }])
                  }
                  className="text-sm text-white/70 hover:text-white"
                >
                  + Add Social Link
                </button>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-400">
                  Preferences
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={preferences.newsletter}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          newsletter: e.target.checked,
                        })
                      }
                      className="rounded border-white/10 bg-black/50"
                    />
                    <span>Receive newsletter</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={preferences.notifications}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          notifications: e.target.checked,
                        })
                      }
                      className="rounded border-white/10 bg-black/50"
                    />
                    <span>Enable notifications</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="px-4 py-2 bg-white text-black rounded hover:bg-white/90"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-2">Bio</h2>
                <p className="text-gray-400">{bio || 'No bio yet'}</p>
              </div>

              {socialLinks.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium mb-2">Social Links</h2>
                  <div className="space-y-2">
                    {socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-400 hover:text-blue-300"
                      >
                        {link.platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-lg font-medium mb-2">Preferences</h2>
                <div className="space-y-1 text-gray-400">
                  <p>Newsletter: {preferences.newsletter ? 'Yes' : 'No'}</p>
                  <p>Notifications: {preferences.notifications ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-white/90"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
