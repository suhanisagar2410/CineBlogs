import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectRoute = () => {
  const authToken = localStorage.getItem('authToken');

  if (authToken === null) {
    return <Navigate to="/login" replace/>;
  }

  return <Outlet />;
};

export default ProtectRoute;
