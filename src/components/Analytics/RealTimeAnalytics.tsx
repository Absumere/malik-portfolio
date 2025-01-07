import { useEffect, useState } from 'react';
import { Card, Title, AreaChart, DonutChart, BarList } from '@tremor/react';
import mixpanel from 'mixpanel-browser';

interface RealTimeMetrics {
  activeUsers: number;
  pageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  events: Array<{
    timestamp: string;
    type: string;
    data: any;
  }>;
}

type TimeFrame = '15m' | '30m' | '1h' | '4h' | '6h' | '12h' | 'D' | '3D' | 'W' | 'M';

const TIME_FRAMES: { value: TimeFrame; label: string }[] = [
  { value: '15m', label: '15 minutes' },
  { value: '30m', label: '30 minutes' },
  { value: '1h', label: '1 hour' },
  { value: '4h', label: '4 hours' },
  { value: '6h', label: '6 hours' },
  { value: '12h', label: '12 hours' },
  { value: 'D', label: '1 day' },
  { value: '3D', label: '3 days' },
  { value: 'W', label: '1 week' },
  { value: 'M', label: '1 month' },
];

const REFRESH_INTERVAL = 5000; // 5 seconds

export default function RealTimeAnalytics() {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    activeUsers: 0,
    pageViews: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    events: [],
  });

  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1h');
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Convert timeFrame to milliseconds
  const getTimeFrameMs = (tf: TimeFrame) => {
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    
    switch (tf) {
      case '15m': return 15 * minute;
      case '30m': return 30 * minute;
      case '1h': return hour;
      case '4h': return 4 * hour;
      case '6h': return 6 * hour;
      case '12h': return 12 * hour;
      case 'D': return day;
      case '3D': return 3 * day;
      case 'W': return 7 * day;
      case 'M': return 30 * day;
      default: return hour;
    }
  };

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const now = new Date();
        const timeFrameMs = getTimeFrameMs(timeFrame);
        const from = new Date(now.getTime() - timeFrameMs);

        const response = await mixpanel.request([
          'jql',
          {
            from_date: from.toISOString(),
            to_date: now.toISOString(),
            type: 'general',
            name: 'Active Users and Events'
          },
        ]);

        // Process real-time data
        const events = response || [];
        const activeUsers = new Set(events.map((e: any) => e.distinct_id)).size;
        const pageViews = events.filter((e: any) => e.name === 'Page View').length;
        
        // Calculate intervals based on time frame
        const intervals = timeFrame === '15m' ? 15 : 
                        timeFrame === '30m' ? 15 :
                        timeFrame === '1h' ? 12 :
                        timeFrame === '4h' ? 16 :
                        timeFrame === '6h' ? 12 :
                        timeFrame === '12h' ? 12 :
                        timeFrame === 'D' ? 24 :
                        timeFrame === '3D' ? 18 :
                        timeFrame === 'W' ? 14 :
                        30; // Month

        const intervalMs = timeFrameMs / intervals;
        
        // Generate chart data points
        const chartData = Array.from({ length: intervals }, (_, i) => {
          const pointEnd = new Date(now.getTime() - (i * intervalMs));
          const pointStart = new Date(pointEnd.getTime() - intervalMs);
          
          const intervalEvents = events.filter((e: any) => {
            const eventTime = new Date(e.time);
            return eventTime >= pointStart && eventTime < pointEnd;
          });

          return {
            timestamp: pointEnd.toISOString(),
            users: new Set(intervalEvents.map((e: any) => e.distinct_id)).size,
            events: intervalEvents.length,
          };
        }).reverse();

        setChartData(chartData);
        
        // Calculate session metrics
        const sessions = events.reduce((acc: any, event: any) => {
          if (!acc[event.distinct_id]) {
            acc[event.distinct_id] = {
              duration: 0,
              lastEvent: null,
              events: [],
            };
          }
          
          const session = acc[event.distinct_id];
          if (session.lastEvent) {
            const gap = new Date(event.time).getTime() - new Date(session.lastEvent).getTime();
            if (gap < 30 * 60 * 1000) { // 30 minute session timeout
              session.duration += gap;
            }
          }
          session.lastEvent = event.time;
          session.events.push(event);
          return acc;
        }, {});

        const totalSessions = Object.keys(sessions).length;
        const avgSessionDuration = totalSessions 
          ? Object.values(sessions).reduce((acc: any, session: any) => acc + session.duration, 0) / totalSessions 
          : 0;

        const bounceRate = totalSessions 
          ? (Object.values(sessions).filter((s: any) => s.events.length === 1).length / totalSessions) * 100 
          : 0;

        setMetrics({
          activeUsers,
          pageViews,
          avgSessionDuration,
          bounceRate,
          events: events.slice(-50),
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching real-time analytics:', error);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchRealTimeData();

    // Set up polling
    const interval = setInterval(fetchRealTimeData, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [timeFrame]);

  const eventCategories = metrics.events.reduce((acc: any, event: any) => {
    acc[event.name] = (acc[event.name] || 0) + 1;
    return acc;
  }, {});

  const eventList = Object.entries(eventCategories)
    .map(([name, count]) => ({
      name,
      value: count as number,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      {/* Header with Time Frame Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Real-time Analytics</h2>
        <div className="relative">
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
            className="appearance-none w-48 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20 cursor-pointer"
          >
            {TIME_FRAMES.map((tf) => (
              <option key={tf.value} value={tf.value} className="bg-gray-900">
                {tf.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Users"
          value={metrics.activeUsers}
          loading={loading}
        />
        <MetricCard
          title="Page Views"
          value={metrics.pageViews}
          loading={loading}
        />
        <MetricCard
          title="Avg. Session"
          value={`${Math.round(metrics.avgSessionDuration / 1000)}s`}
          loading={loading}
        />
        <MetricCard
          title="Bounce Rate"
          value={`${Math.round(metrics.bounceRate)}%`}
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <Title className="text-white">Real-time Activity</Title>
          <AreaChart
            className="h-72 mt-4"
            data={chartData}
            index="timestamp"
            categories={['users', 'events']}
            colors={['cyan', 'purple']}
            valueFormatter={(number) =>
              Intl.NumberFormat('us').format(number).toString()
            }
            showAnimation={true}
            curveType="natural"
          />
        </Card>

        <Card className="bg-white/5 border-white/10">
          <Title className="text-white">Event Distribution</Title>
          <DonutChart
            className="h-72 mt-4"
            data={eventList}
            category="value"
            index="name"
            colors={['cyan', 'purple', 'emerald', 'rose', 'indigo']}
            valueFormatter={(number) =>
              Intl.NumberFormat('us').format(number).toString()
            }
            showAnimation={true}
          />
        </Card>
      </div>

      {/* Recent Events */}
      <Card className="bg-white/5 border-white/10">
        <Title className="text-white">Recent Events</Title>
        <div className="mt-4">
          <BarList
            data={eventList}
            className="text-white"
            valueFormatter={(number) =>
              Intl.NumberFormat('us').format(number).toString()
            }
          />
        </div>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, loading }: { title: string; value: string | number; loading: boolean }) {
  return (
    <Card className="bg-white/5 border-white/10">
      <Title className="text-white/60">{title}</Title>
      {loading ? (
        <div className="h-8 w-20 bg-white/10 animate-pulse rounded mt-2" />
      ) : (
        <p className="text-2xl font-semibold text-white mt-2">{value}</p>
      )}
    </Card>
  );
}
