import React, { createContext, useState, useCallback } from 'react';
import api from '../services/api';

type User = {
  username: string;
  email?: string;
};

type UserContextType = {
  user: User | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    const csrfToken = await api.get(`/auth/csrf-token`).then((res) => res.data.csrfToken);

    const response = await api.post(
      '/auth/login',
      { username, password },
      {
        headers: {
          'X-Csrf-Token': csrfToken,
        },
      }
    );

    setUser(response.data.user); // Save user info
    setAccessToken(response.data.accessToken); // Save access token
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
  };

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await api.post('/auth/refresh-token');
      setAccessToken(response.data.accessToken);
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      logout();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, accessToken, login, logout, refreshAccessToken }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;