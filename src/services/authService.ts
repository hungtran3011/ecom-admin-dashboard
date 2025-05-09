import axios from 'axios';
import axiosInstance from './axios';
import { jwtDecode } from 'jwt-decode';
import type { JWTPayload } from '../types/auth.types';
import { getCsrfToken } from './csrf';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create a separate axios instance for refresh calls to avoid interceptor loops
const refreshClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export async function fetchCsrfToken() {
  // Always force a new token for login
  return getCsrfToken(true);
}

export async function loginUser(email: string, password: string) {
  // First get a fresh CSRF token
  const csrfToken = await fetchCsrfToken();
  
  if (!csrfToken) {
    throw new Error("Failed to obtain CSRF token for authentication");
  }
  
  // Try getting the cookie token as a fallback
  const cookieToken = Cookies.get('csrf-token');
  const tokenToUse = cookieToken || csrfToken;
  
  // Then login
  const response = await axiosInstance.post(
    '/auth/admin/sign-in',
    { email, password },
    {
      headers: {
        'X-CSRF-Token': tokenToUse,
      },
    }
  );
  
  return response.data;
}

export async function logoutUser(accessToken: string) {
  // Get a fresh CSRF token for logout
  const csrfToken = await getCsrfToken();
  
  return axiosInstance.post('/auth/sign-out', {}, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-CSRF-Token': csrfToken || '',
    }
  });
}

export async function refreshAccessToken() {
  // Use the separate client to avoid interceptor loops  
  // Get CSRF token for refresh request if needed
  const csrfToken = Cookies.get('csrf-token'); 
  
  const response = await refreshClient.post('/auth/token/refresh', {}, {
    headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : {}
  });
  
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