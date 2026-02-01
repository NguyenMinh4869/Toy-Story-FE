import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Tag, Percent, Layers, Ticket, Warehouse } from 'lucide-react';
import { ROUTES } from '../../routes/routePaths';
import { getUserRole } from '../../services/authService';

interface SidebarProps {
  /**
   * Role-specific mode: 'admin' or 'staff'
   * Determines which routes to show
   */
  mode?: 'admin' | 'staff';
}

const Sidebar: React.FC<SidebarProps> = ({ mode }) => {
  const userRole = getUserRole();
  const effectiveMode = mode || (userRole === 'Admin' ? 'admin' : 'staff');
  
  // Define navigation links based on role
  const getNavLinks = (): Array<{ to: string; icon: React.ReactNode; label: string }> => {
    const baseLinks: Array<{ to: string; icon: React.ReactNode; label: string }> = [
      { 
        to: effectiveMode === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.STAFF_DASHBOARD, 
        icon: <LayoutDashboard size={20} />, 
        label: 'Dashboard' 
      },
    ];

    // Products management is ADMIN-ONLY (Staff only manages warehouse products)
    if (effectiveMode === 'admin') {
      baseLinks.push({ 
        to: ROUTES.ADMIN_PRODUCTS, 
        icon: <ShoppingBag size={20} />, 
        label: 'Products' 
      });
    }

    // View-only pages for Staff, full access for Admin
    baseLinks.push(
      { 
        to: effectiveMode === 'admin' ? ROUTES.ADMIN_BRANDS : ROUTES.STAFF_BRANDS, 
        icon: <Tag size={20} />, 
        label: 'Brands' 
      },
      { 
        to: effectiveMode === 'admin' ? ROUTES.ADMIN_SETS : ROUTES.STAFF_SETS, 
        icon: <Layers size={20} />, 
        label: 'Sets' 
      },
      { 
        to: effectiveMode === 'admin' ? ROUTES.ADMIN_WAREHOUSE : ROUTES.STAFF_WAREHOUSE, 
        icon: <Warehouse size={20} />, 
        label: 'Warehouse' 
      }
    );

    // Staff management is ADMIN-ONLY
    if (effectiveMode === 'admin') {
      baseLinks.push({ 
        to: ROUTES.ADMIN_STAFF, 
        icon: <Users size={20} />, 
        label: 'Staff' 
      });
    }

    // Vouchers are ADMIN-ONLY, Promotions for both roles
    if (effectiveMode === 'admin') {
      baseLinks.push({ 
        to: ROUTES.ADMIN_VOUCHERS, 
        icon: <Ticket size={20} />, 
        label: 'Vouchers' 
      });
    }

    baseLinks.push({ 
      to: effectiveMode === 'admin' ? ROUTES.ADMIN_PROMOTIONS : ROUTES.STAFF_PROMOTIONS, 
      icon: <Percent size={20} />, 
      label: 'Promotions' 
    });

    return baseLinks;
  };

  const navLinks = getNavLinks();

  // Staff uses emerald/teal theme, Admin uses red theme
  const themeColors = effectiveMode === 'staff' 
    ? {
        activeBg: 'bg-emerald-100',
        activeText: 'text-emerald-700',
        buttonBg: 'bg-emerald-600',
        buttonHover: 'hover:bg-emerald-700'
      }
    : {
        activeBg: 'bg-red-100',
        activeText: 'text-red-700',
        buttonBg: 'bg-red-600',
        buttonHover: 'hover:bg-red-700'
      };

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
                  ? `${themeColors.activeBg} ${themeColors.activeText}`
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
          className={`w-full ${themeColors.buttonBg} text-white text-center font-medium py-2 px-4 rounded-md ${themeColors.buttonHover} transition-colors no-underline block`}
        >
          Home page
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
