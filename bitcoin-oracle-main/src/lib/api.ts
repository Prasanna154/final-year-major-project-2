/**
 * API Configuration
 * 
 * To point the application to a hosted backend, set the VITE_API_BASE_URL 
 * environment variable in your deployment platform (e.g., Vercel).
 * Default falls back to localhost for development.
 */

const getApiBaseUrl = () => {
  // Check if an environment variable is defined
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    // Ensure no trailing slash
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  
  // Default for local development
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    RESET: `${API_BASE_URL}/api/auth/reset`,
  },
  PREDICTIONS: {
    SAVE: `${API_BASE_URL}/api/predictions`,
    GET_LATEST: (userId: string) => `${API_BASE_URL}/api/predictions/${userId}`,
  }
};
