import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default AdminRoute;
