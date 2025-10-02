// API Configuration
// This file centralizes API endpoint configuration for different environments

const API_CONFIG = {
  development: 'http://localhost:3000',
  production: 'https://parentpal-api-34u7.onrender.com'
};

// Determine current environment
const ENV = import.meta.env.MODE || 'development';

// Export the appropriate API URL
export const API_URL = API_CONFIG[ENV];

// Helper function to build API endpoints
export const buildApiUrl = (path) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};

export default API_URL;
