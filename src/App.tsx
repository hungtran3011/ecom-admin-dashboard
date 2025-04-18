import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AdminRoutes from './routes/AdminRoutes';
import LoginPage from './pages/LoginPage'; // Import the LoginPage

const App: React.FC = () => (
  <div className="flex h-screen bg-gray-100">
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin/*"
        element={
          <div className="flex w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="p-4 overflow-auto">
                <AdminRoutes />
              </main>
            </div>
          </div>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </div>
);

export default App;