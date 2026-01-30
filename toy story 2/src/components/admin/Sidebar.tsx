import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, ClipboardList } from 'lucide-react';
import { ROUTES } from '../../routes/routePaths';

const Sidebar: React.FC = () => {
  const navLinks = [
    { to: ROUTES.ADMIN_DASHBOARD, icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: ROUTES.ADMIN_PRODUCTS, icon: <ShoppingBag size={20} />, label: 'Products' },
    { to: ROUTES.ADMIN_STAFF, icon: <Users size={20} />, label: 'Staff Management' },
    { to: ROUTES.ADMIN_ORDERS, icon: <ClipboardList size={20} />, label: 'Orders' },
  ];

  return (
    <div className="w-64 bg-white flex flex-col flex-shrink-0 border-r border-gray-200">
      <div className="h-20 flex items-center justify-center border-b border-gray-200">
        <Link to="/" className="relative h-[47px] flex items-center no-underline text-inherit">
            <img 
              src="https://www.figma.com/api/mcp/asset/a3292b82-feb6-483d-a4f2-619ec8b796dd" 
              alt="Logo" 
              className="h-[47px] w-auto"
            />
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {link.icon}
            <span className="ml-3">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-6 pb-6">
        <Link 
          to={ROUTES.HOME} 
          className="w-full bg-red-600 text-white text-center font-medium py-2 px-4 rounded-md hover:bg-red-700 transition-colors no-underline"
        >
          Home page
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
