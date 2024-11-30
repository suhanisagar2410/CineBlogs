import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectRoute = () => {
  const isAuthenticated = useSelector((state) => state.Auth.status);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectRoute;
