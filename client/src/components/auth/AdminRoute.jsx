// src/components/auth/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;

  const decoded = jwtDecode(token);

  // ✅ Redirect to user dashboard if not admin
  if (decoded.role !== 'admin') return <Navigate to="/user-dashboard" />;

  return children;
};

export default AdminRoute;
