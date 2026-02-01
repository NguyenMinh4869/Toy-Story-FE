import React from 'react';
import RoleAwareSidebar from '../components/shared/RoleAwareSidebar';
import RoleAwareHeader from '../components/shared/RoleAwareHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
  /**
   * Role-specific mode: 'admin' or 'staff'
   * Determines sidebar and header behavior
   */
  mode: 'admin' | 'staff';
}

/**
 * Unified Dashboard Layout for both Admin and Staff
 * Provides consistent UI with role-based access control
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, mode }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <RoleAwareSidebar mode={mode} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <RoleAwareHeader mode={mode} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
