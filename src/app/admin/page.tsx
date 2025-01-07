'use client';

import { useEffect } from 'react';
import { Card, Title, Text } from '@tremor/react';
import {
  UsersIcon,
  EyeIcon,
  ClockIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import RealTimeAnalytics from '@/components/Analytics/RealTimeAnalytics';
import { initializeAnalytics, cleanupAnalytics } from '@/utils/analytics';

export default function AdminDashboard() {
  useEffect(() => {
    // Initialize analytics when dashboard mounts
    initializeAnalytics();

    // Cleanup analytics when dashboard unmounts
    return () => {
      cleanupAnalytics();
    };
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Analytics Dashboard</h1>
      </div>

      {/* Real-time Analytics */}
      <RealTimeAnalytics />

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10">
          <Title className="text-white">Top Pages</Title>
          <div className="mt-4 space-y-3">
            {[
              { path: '/', views: 1234 },
              { path: '/portfolio', views: 856 },
              { path: '/about', views: 643 },
            ].map((page) => (
              <div
                key={page.path}
                className="flex items-center justify-between py-2 border-b border-white/10"
              >
                <Text className="text-white/80">{page.path}</Text>
                <Text className="text-white/60">{page.views} views</Text>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <Title className="text-white">Traffic Sources</Title>
          <div className="mt-4 space-y-3">
            {[
              { source: 'Direct', percentage: 45 },
              { source: 'Social', percentage: 30 },
              { source: 'Search', percentage: 25 },
            ].map((source) => (
              <div
                key={source.source}
                className="flex items-center justify-between py-2 border-b border-white/10"
              >
                <Text className="text-white/80">{source.source}</Text>
                <Text className="text-white/60">{source.percentage}%</Text>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <Title className="text-white">User Locations</Title>
          <div className="mt-4 space-y-3">
            {[
              { country: 'Germany', users: 456 },
              { country: 'United States', users: 325 },
              { country: 'United Kingdom', users: 234 },
            ].map((location) => (
              <div
                key={location.country}
                className="flex items-center justify-between py-2 border-b border-white/10"
              >
                <Text className="text-white/80">{location.country}</Text>
                <Text className="text-white/60">{location.users} users</Text>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
