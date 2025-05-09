import axios from 'axios';
import axiosInstance from './axios';
import { jwtDecode } from 'jwt-decode';
import type { JWTPayload } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL;

// Create a separate axios instance for refresh calls to avoid interceptor loops
const refreshClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export async function fetchCsrfToken() {
  const response = await axiosInstance.get('/auth/csrf-token');
  return response.data.csrfToken;
}

export async function loginUser(email: string, password: string) {
  // First get CSRF token
  const csrfToken = await fetchCsrfToken();
  
  // Then login
  const response = await axiosInstance.post(
    '/auth/admin/sign-in',
    { email, password },
    {
      headers: {
        'X-Csrf-Token': csrfToken,
      },
    }
  );
  
  return response.data;
}

export async function logoutUser(accessToken: string) {
  return axiosInstance.post('/auth/sign-out', {}, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    }
  });
}

export async function refreshAccessToken() {
  // Use the separate client to avoid interceptor loops
  const response = await refreshClient.post('/auth/token/refresh');
  
  if (response.data.accessToken) {
    // Store the new token
    localStorage.setItem('accessToken', response.data.accessToken);
    
    const decodedToken = jwtDecode<JWTPayload>(response.data.accessToken);
    return {
      ...response.data,
      user: decodedToken.user
    };
  }
  
  return response.data;
}

// export async function fetchUserProfile(accessToken: string) {
//   const response = await axiosInstance.get('/auth/admin/me', {
//     headers: {
//       'Authorization': `Bearer ${accessToken}`,
//     }
//   });
//   return response.data;
// }