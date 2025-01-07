import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel with your project token
mixpanel.init('d3b2467991dae6ba76dc4f27236b61f1', {
  debug: process.env.NODE_ENV === 'development',
  ignore_dnt: true,
  api_host: 'https://api-eu.mixpanel.com',
  persistence: 'localStorage',
  upgrade: true,
  loaded: (mixpanel) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Mixpanel initialized successfully');
    }
  }
});

interface PerformanceMetrics {
  loadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
}

interface UserSession {
  startTime: number;
  lastActive: number;
  pageViews: number;
  interactions: number;
}

let currentSession: UserSession = {
  startTime: Date.now(),
  lastActive: Date.now(),
  pageViews: 0,
  interactions: 0,
};

// Enhanced page view tracking with performance metrics
export const trackPageView = async (pageName: string) => {
  currentSession.pageViews++;
  currentSession.lastActive = Date.now();

  // Collect performance metrics
  const performanceMetrics = await getPerformanceMetrics();

  mixpanel.track('Page View', {
    page: pageName,
    timestamp: new Date().toISOString(),
    session_duration: Date.now() - currentSession.startTime,
    page_views_in_session: currentSession.pageViews,
    referrer: document.referrer,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    performance: performanceMetrics,
    user_agent: window.navigator.userAgent,
    language: window.navigator.language,
  });

  // Update user profile with session data
  mixpanel.people.set({
    last_seen: new Date().toISOString(),
    '$pageviews': mixpanel.get_property('$pageviews') + 1,
    total_session_time: Date.now() - currentSession.startTime,
  });

  // Increment page view counter
  mixpanel.people.increment('pageviews');
};

// Track user engagement and behavior
export const trackEngagement = (
  eventName: string,
  elementId: string,
  properties: Record<string, any> = {}
) => {
  currentSession.interactions++;
  currentSession.lastActive = Date.now();

  mixpanel.track('User Engagement', {
    event: eventName,
    element_id: elementId,
    ...properties,
    timestamp: new Date().toISOString(),
    session_interactions: currentSession.interactions,
    time_since_last_interaction: Date.now() - currentSession.lastActive,
  });
};

// Track file operations with detailed metrics
export const trackFileOperation = (
  operationType: 'upload' | 'download' | 'delete',
  fileDetails: {
    type: string;
    size: number;
    name: string;
    extension: string;
  },
  success: boolean,
  duration: number,
  additionalProps: Record<string, any> = {}
) => {
  mixpanel.track('File Operation', {
    operation: operationType,
    ...fileDetails,
    success,
    duration_ms: duration,
    transfer_speed: fileDetails.size / duration, // bytes per ms
    timestamp: new Date().toISOString(),
    ...additionalProps,
  });

  // Update aggregate metrics
  mixpanel.people.increment({
    [`total_${operationType}s`]: 1,
    [`${operationType}_bytes`]: fileDetails.size,
    [`${operationType}_duration_ms`]: duration,
  });
};

// Track user navigation flow
export const trackNavigation = (from: string, to: string, duration: number) => {
  mixpanel.track('Navigation Flow', {
    from_page: from,
    to_page: to,
    duration_ms: duration,
    timestamp: new Date().toISOString(),
  });
};

// Track error events
export const trackError = (
  errorType: string,
  message: string,
  stack?: string,
  context?: Record<string, any>
) => {
  mixpanel.track('Error', {
    error_type: errorType,
    message,
    stack,
    ...context,
    timestamp: new Date().toISOString(),
  });
};

// Track API calls
export const trackAPICall = (
  endpoint: string,
  method: string,
  duration: number,
  success: boolean,
  statusCode?: number
) => {
  mixpanel.track('API Call', {
    endpoint,
    method,
    duration_ms: duration,
    success,
    status_code: statusCode,
    timestamp: new Date().toISOString(),
  });
};

// Track user session data
export const trackSessionData = () => {
  const sessionDuration = Date.now() - currentSession.startTime;
  
  mixpanel.track('Session Update', {
    duration_ms: sessionDuration,
    page_views: currentSession.pageViews,
    interactions: currentSession.interactions,
    avg_time_between_interactions: sessionDuration / (currentSession.interactions || 1),
    timestamp: new Date().toISOString(),
  });
};

// Track real-time user presence
let presenceInterval: NodeJS.Timeout;
export const startPresenceTracking = () => {
  presenceInterval = setInterval(() => {
    if (document.visibilityState === 'visible') {
      mixpanel.track('User Present', {
        timestamp: new Date().toISOString(),
        session_duration: Date.now() - currentSession.startTime,
      });
    }
  }, 30000); // Every 30 seconds
};

export const stopPresenceTracking = () => {
  clearInterval(presenceInterval);
};

// Get performance metrics
const getPerformanceMetrics = async (): Promise<PerformanceMetrics> => {
  if (!window.performance) {
    return {
      loadTime: 0,
      timeToInteractive: 0,
      firstContentfulPaint: 0,
    };
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint').find(
    (entry) => entry.name === 'first-contentful-paint'
  );

  return {
    loadTime: navigation?.loadEventEnd || 0,
    timeToInteractive: navigation?.domInteractive || 0,
    firstContentfulPaint: paint?.startTime || 0,
  };
};

// Set super properties for all events
export const setSuperProperties = (properties: Record<string, any>) => {
  mixpanel.register(properties);
};

// Initialize analytics with user data
export const initializeAnalytics = (userId?: string) => {
  if (userId) {
    mixpanel.identify(userId);
  }

  // Set initial super properties
  setSuperProperties({
    app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV,
    platform: 'web',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  // Start presence tracking
  startPresenceTracking();

  // Set up session tracking
  window.addEventListener('beforeunload', () => {
    trackSessionData();
    stopPresenceTracking();
  });

  // Track visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      trackSessionData();
    }
  });
};

// Clean up analytics
export const cleanupAnalytics = () => {
  stopPresenceTracking();
  trackSessionData();
};
