import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getUserRole } from '../services/authService';
import { ROUTES } from './routePaths';

interface ProtectedRouteProps {
  /**
   * Array of roles allowed to access this route
   * Valid values: 'Admin', 'Staff', 'Member'
   */
  allowedRoles: string[];
}

/**
 * Protected Route Component with Role-Based Access Control (RBAC)
 * 
 * Features:
 * - Redirects unauthenticated users to login
 * - Prevents unauthorized access based on user roles
 * - Provides smart redirects to appropriate dashboards
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const userRole = getUserRole();
  const location = useLocation();

  // Not authenticated - redirect to login
  if (!userRole) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(userRole)) {
    // User is authenticated but doesn't have access
    // Redirect to their appropriate dashboard instead of login
    const redirectTo = getDashboardByRole(userRole);
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

/**
 * Helper function to get the appropriate dashboard based on user role
 */
export const getDashboardByRole = (role: string | null): string => {
  switch (role) {
    case 'Admin':
      return ROUTES.ADMIN_DASHBOARD;
    case 'Staff':
      return ROUTES.STAFF_DASHBOARD;
    case 'Member':
    default:
      return ROUTES.HOME;
  }
};

export default ProtectedRoute;
