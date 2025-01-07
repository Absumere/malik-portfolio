'use client';

import { useEffect, useState } from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  GlobeAltIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  topCountries: Array<{
    country: string;
    _count: number;
  }>;
  averageDuration: number;
  storageUsage: {
    total: number;
    count: number;
  };
  dailyVisits: Array<{
    date: string;
    count: number;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
    // Refresh data every minute
    const interval = setInterval(loadAnalytics, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const analyticsData = await response.json();
      setData(analyticsData);
      setError(null);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error}
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Views',
      value: data?.totalVisits.toLocaleString() || '0',
      change: '+0%',
      icon: ChartBarIcon,
    },
    {
      name: 'Unique Visitors',
      value: data?.uniqueVisitors.toLocaleString() || '0',
      change: '+0%',
      icon: UsersIcon,
    },
    {
      name: 'Top Country',
      value: data?.topCountries[0]?.country || 'N/A',
      change: `${data?.topCountries[0]?._count || 0} visitors`,
      icon: GlobeAltIcon,
    },
    {
      name: 'Avg. Visit Duration',
      value: `${Math.floor((data?.averageDuration || 0) / 60)}m`,
      change: `${(data?.averageDuration || 0) % 60}s`,
      icon: ClockIcon,
    },
  ];

  // Prepare chart data
  const chartData = {
    labels: data?.dailyVisits.map(visit => 
      new Date(visit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ) || [],
    datasets: [
      {
        label: 'Daily Visits',
        data: data?.dailyVisits.map(visit => visit.count) || [],
        fill: true,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Analytics</h1>
        <p className="mt-2 text-gray-400">
          Real-time statistics and visitor analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-gray-900 rounded-lg p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-gray-800 rounded-lg">
                <stat.icon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-100">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-500">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Visitor Trends</h2>
          <div className="h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Geographic Distribution</h2>
          <div className="space-y-4">
            {data?.topCountries.map((country) => (
              <div key={country.country} className="flex items-center justify-between">
                <span className="text-gray-300">{country.country}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(country._count / (data?.totalVisits || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-gray-400 w-16 text-right">
                    {country._count} visits
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Storage Usage */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Storage Usage
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Used Storage</span>
              <span className="text-gray-400">
                {formatBytes(data?.storageUsage.total || 0)} / {formatBytes(500 * 1024 * 1024)}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${((data?.storageUsage.total || 0) / (500 * 1024 * 1024)) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Total Files</p>
              <p className="text-2xl font-semibold text-gray-100">
                {data?.storageUsage.count || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Average File Size</p>
              <p className="text-2xl font-semibold text-gray-100">
                {formatBytes((data?.storageUsage.total || 0) / (data?.storageUsage.count || 1))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
