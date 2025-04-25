import React from 'react';;
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import AdminRoutes from './routes/AdminRoutes';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => (
  <div className="flex h-screen bg-gray-100">
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route path="/admin/*" element={<ProtectedRoute />}>
        <Route
          path="*"
          element={
            <div className="flex w-full">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-4 overflow-auto pb-20 md:pb-4">
                  <AdminRoutes />
                </main>
                <MobileNav />
              </div>
            </div>
          }
        />
      </Route>

      {/* Redirect all unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </div>
);

export default App;