import axios, { AxiosInstance } from 'axios';
import { refreshAccessToken as refreshToken } from '../services/authService';

// Flag to track if a refresh is in progress
let isRefreshing = false;
// Queue of requests waiting for token refresh
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to process queue of waiting requests
const processQueue = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// Apply the token refresh interceptor to an axios instance
export const applyTokenRefreshInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response, 
    async (error) => {
      const originalRequest = error.config;
      
      // If the error is 401 with "Token expired" message and request hasn't been retried yet
      if (
        error.response?.status === 401 && 
        error.response?.data?.message === "Token expired" && 
        !originalRequest._retry
      ) {
        // Mark this request as retried to avoid infinite loops
        originalRequest._retry = true;
        
        // If a refresh is not currently in progress
        if (!isRefreshing) {
          isRefreshing = true;
          
          try {
            // Call token refresh endpoint
            const response = await refreshToken();
            
            // If refresh succeeded
            if (response && response.accessToken) {
              const newToken = response.accessToken;
              
              // Update the original request Authorization header
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              
              // Process all waiting requests
              processQueue(newToken);
              
              // Retry the original request
              return axios(originalRequest);
            } else {
              // If refresh failed, reject all waiting requests
              refreshSubscribers.forEach(callback => callback(''));
              refreshSubscribers = [];
              
              // Force logout or redirect to login here if needed
              window.location.href = '/login'; // Or dispatch a logout action
              return Promise.reject(error);
            }
          } catch (refreshError) {
            // If refresh failed, reject all waiting requests
            refreshSubscribers.forEach(callback => callback(''));
            refreshSubscribers = [];
            
            // Force logout or redirect to login
            window.location.href = '/login'; // Or dispatch a logout action
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          // If a refresh is already in progress, add this request to the queue
          const retryOriginalRequest = new Promise<any>(resolve => {
            refreshSubscribers.push((token: string) => {
              if (token) {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                resolve(axios(originalRequest));
              } else {
                resolve(Promise.reject(error));
              }
            });
          });
          
          return retryOriginalRequest;
        }
      }
      
      // If not a token expiration error, just reject as normal
      return Promise.reject(error);
    }
  );
};