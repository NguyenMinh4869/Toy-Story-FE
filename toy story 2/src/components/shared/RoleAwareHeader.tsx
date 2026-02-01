import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/routePaths';
import { getUserRole, getStoredUser, logout } from '../../services/authService';

interface HeaderProps {
  /**
   * Role-specific mode: 'admin' or 'staff'
   * Determines which routes to navigate to
   */
  mode?: 'admin' | 'staff';
}

const Header: React.FC<HeaderProps> = ({ mode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userRole = getUserRole();
  const effectiveMode = mode || (userRole === 'Admin' ? 'admin' : 'staff');
  const displayName = effectiveMode === 'admin' ? 'Admin' : 'Staff';

  // Get user name from stored user data
  useEffect(() => {
    const user = getStoredUser();
    if (user?.name) {
      setUserName(user.name);
    } else if (user?.email) {
      // Fallback to email if name is not available
      setUserName(user.email.split('@')[0]);
    } else {
      setUserName(displayName);
    }
  }, [displayName]);

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

  // Determine which product/brand route to use based on mode
  const productsRoute = effectiveMode === 'admin' ? ROUTES.ADMIN_PRODUCTS : ROUTES.STAFF_PRODUCTS;
  const brandsRoute = effectiveMode === 'admin' ? ROUTES.ADMIN_BRANDS : ROUTES.STAFF_BRANDS;

  const isProducts = location.pathname.startsWith(productsRoute);
  const isBrands = location.pathname.startsWith(brandsRoute);
  const placeholder = isProducts
    ? 'Search products...'
    : isBrands
    ? 'Search brands...'
    : 'Search...';

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    const params = new URLSearchParams({ q }).toString();
    if (isProducts) {
      navigate(`${productsRoute}?${params}`);
      return;
    }
    if (isBrands) {
      navigate(`${brandsRoute}?${params}`);
      return;
    }
  };

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
      <div className="flex items-center gap-6">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative text-gray-500 hover:text-gray-700">
            <Bell size={24} />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </button>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            >
              <span className="font-semibold text-gray-700 text-right">{userName}</span>
              <div className={`w-10 h-10 rounded-full ${effectiveMode === 'admin' ? 'bg-red-500' : 'bg-emerald-500'} flex items-center justify-center`}>
                <User size={24} className="text-white" />
              </div>
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500 mt-1">{effectiveMode === 'admin' ? 'Administrator' : 'Staff Member'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
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
