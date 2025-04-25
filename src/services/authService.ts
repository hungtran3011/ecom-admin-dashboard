// src/services/authService.ts
import axiosInstance from './axios';
import { jwtDecode } from 'jwt-decode';
import type { JWTPayload } from '../types/auth.types';

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
  const response = await axiosInstance.post('/auth/token/refresh');
  if (response.data.accessToken) {
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