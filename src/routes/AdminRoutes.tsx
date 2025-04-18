import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Orders from '../pages/Orders';
import Users from '../pages/Users';

const AdminRoutes: React.FC = () => (
  <Routes>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="products" element={<Products />} />
    <Route path="orders" element={<Orders />} />
    <Route path="users" element={<Users />} />
  </Routes>
);

export default AdminRoutes;