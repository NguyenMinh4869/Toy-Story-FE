import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getUserRole } from '../services/authService';
import { ROUTES } from './routePaths';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const userRole = getUserRole();

  if (!userRole || !allowedRoles.includes(userRole)) {
    // Redirect to login if user is not authenticated or doesn't have the required role
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
