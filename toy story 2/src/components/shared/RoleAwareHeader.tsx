import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
import { getUserRole, getStoredUser, logout } from '../../services/authService';
import { getSimpleWarehouseById } from '@/services/warehouseService';

interface HeaderProps {
  /**
   * Role-specific mode: 'admin' or 'staff'
   * Determines which routes to navigate to
   */
  mode?: 'admin' | 'staff';
}

const Header: React.FC<HeaderProps> = ({ mode }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [warehouse, setWarehouse] = useState<any | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userRole = getUserRole();
  const effectiveMode = mode || (userRole === 'Admin' ? 'admin' : 'staff');
  const displayName = effectiveMode === 'admin' ? 'Quan tri vien' : 'Nhan vien';
  const isAdminMode = effectiveMode === 'admin';

  useEffect(() => {
    const user = getStoredUser();

    if (user?.name) {
      setUserName(user.name);
    } else if (user?.email) {
      setUserName(user.email.split('@')[0]);
    } else {
      setUserName(displayName);
    }
  }, [displayName]);

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const warehouse = await getSimpleWarehouseById();
        if (warehouse) {
          setWarehouse(warehouse!);
        }
      } catch (error) {
        console.error('Error fetching warehouse:', error);
      }
    };

    fetchWarehouse();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className={`h-20 bg-white border-b border-gray-200 flex items-center px-6 flex-shrink-0 ${isAdminMode ? 'justify-end' : 'justify-between'}`}>
      {!isAdminMode && <h1 className="text-2xl font-black text-gray-800">Tổng quan kho {warehouse?.name}</h1>}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="font-black text-gray-700 text-right">{warehouse?.location}</span>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            >
              <span className="font-black text-gray-700 text-right">{userName}</span>
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-black text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500 mt-1">{effectiveMode === 'admin' ? 'Quan tri vien' : 'Nhan vien'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
