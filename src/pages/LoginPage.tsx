import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const attemptedLoginRef = useRef(false);
  
  const { 
    login, 
    refreshAccessToken, 
    isRefreshing,
    isAuthenticated
  } = useUser();
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Skip completely if we're already refreshing
    if (isRefreshing) return;
    
    // Use ref instead of state to truly run only once
    if (attemptedLoginRef.current) return;

    const attemptLogin = async () => {
      console.log("Attempting silent login...");
      attemptedLoginRef.current = true;
      
      try {
        await refreshAccessToken();
        // Navigation now happens in the next effect
      } catch (error) {
        console.error('Silent login failed:', error);
        // Stay on login page
      }
    };

    attemptLogin();
  }, [refreshAccessToken, isRefreshing]);
  
  // Separate effect for navigation to break the dependency loop
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, navigating...");
      const redirectTo = (location.state as { from?: string })?.from || '/admin/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      console.log('Login form submitted:', email);
      await login(email, password);
      
      // Login successful - don't navigate here, let the authentication effect handle it
      console.log('Login successful');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    }
  };

  // Show loading state while trying to refresh the session
  if (isRefreshing) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Trying to refresh your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 w-full">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow-md rounded w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;