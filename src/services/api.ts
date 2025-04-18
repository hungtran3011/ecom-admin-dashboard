import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient(); // Export the shared QueryClient instance

const api = axios.create({
  baseURL: import.meta.env.API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

console.log('API URL:', api.defaults.baseURL);

// Fetch CSRF token
export const fetchCsrfToken = async () => {
  const response = await api.get('/auth/csrf-token');
  return response.data.csrfToken;
};

// Interceptor to add CSRF token and access token
api.interceptors.request.use(async (config) => {
  const csrfToken = await queryClient.fetchQuery({
    queryKey: ['csrfToken'],
    queryFn: fetchCsrfToken,
    staleTime: 15 * 60 * 1000, // Cache CSRF token for 15 minutes
  });

  if (csrfToken) {
    config.headers['X-Csrf-Token'] = csrfToken;
  }

  const accessToken = queryClient.getQueryData<string>(['accessToken']);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Interceptor to handle access token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh the access token
        const { data } = await api.post('/auth/refresh-token');
        queryClient.setQueryData(['accessToken'], data.accessToken);
        
        // Set defaults for the accessToken query
        queryClient.setQueryDefaults(['accessToken'], {
          staleTime: 30 * 60 * 1000, // Cache refreshed access token for 30 minutes
        });

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // Optionally, handle logout or redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default api;