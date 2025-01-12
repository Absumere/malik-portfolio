'use client';

import { Suspense } from 'react';
import { Card, Title, Text, Button, TextInput, Select, SelectItem } from '@tremor/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

function SettingsContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
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
    theme: 'dark',
    language: 'en',
  });

  const existingSettings = useQuery(api.settings.get);
  const updateSettings = useMutation(api.settings.update);

  useEffect(() => {
    if (existingSettings) {
      setSettings(existingSettings);
    }
  }, [existingSettings]);

  if (isLoading) {
    return (
      <div className="bg-black p-8 flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
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
              <TextInput
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
              <TextInput
                type="text"
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
              <TextInput
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
                <TextInput
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

        {/* Theme and Language */}
        <Card className="bg-black border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6">Theme and Language</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Theme
              </label>
              <Select
                value={settings.theme}
                onValueChange={(value) => setSettings({ ...settings, theme: value })}
              >
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Language
              </label>
              <Select
                value={settings.language}
                onValueChange={(value) => setSettings({ ...settings, language: value })}
              >
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </Select>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="bg-black p-8 flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
