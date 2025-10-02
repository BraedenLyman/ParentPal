// API Configuration
const API_CONFIG = {
  development: 'http://localhost:3000',
  production: 'https://parentpal-api-34u7.onrender.com'
};

const isDev = typeof window !== 'undefined' &&
              (window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1');

// Export the appropriate API URL
export const API_URL = isDev ? API_CONFIG.development : API_CONFIG.production;

// Helper function to build API endpoints
export const buildApiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};

export default API_URL;
