// Environment configuration utility
export const config = {
  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // API configuration
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  
  // Endpoints
  endpoints: {
    phases: '/api/videos/phases',
    videos: '/api/videos/list',
    aspects: '/api/aspects'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${config.apiBaseUrl}${endpoint}`;
};

export default config;
