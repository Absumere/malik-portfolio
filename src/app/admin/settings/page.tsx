'use client';

import { useState, useEffect } from 'react';
import { Card } from '@tremor/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: '',
    description: '',
    email: '',
    socialLinks: {
      twitter: '',
      github: '',
      linkedin: '',
      instagram: '',
    },
  });

  // Fetch settings from Convex
  const userSettings = useQuery(api.users.getSettings);
  const updateSettings = useMutation(api.users.updateSettings);

  useEffect(() => {
    if (userSettings) {
      setSettings({
        siteName: userSettings.siteName || '',
        description: userSettings.description || '',
        email: userSettings.email || '',
        socialLinks: userSettings.socialLinks || {
          twitter: '',
          github: '',
          linkedin: '',
          instagram: '',
        },
      });
    }
  }, [userSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
    setSaving(false);
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-2 text-gray-400">Configure your portfolio settings and preferences</p>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <Card className="bg-black border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/20"
                placeholder="Your Site Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <textarea
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/20"
                rows={4}
                placeholder="Site Description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/20"
                placeholder="contact@example.com"
              />
            </div>
          </div>
        </Card>

        {/* Social Links */}
        <Card className="bg-black border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Social Links</h2>
          <div className="space-y-4">
            {Object.entries(settings.socialLinks).map(([platform, url]) => (
              <div key={platform}>
                <label className="block text-sm font-medium text-gray-400 mb-1 capitalize">
                  {platform}
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      [platform]: e.target.value,
                    },
                  })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/20"
                  placeholder={`https://${platform.toLowerCase()}.com/yourusername`}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
