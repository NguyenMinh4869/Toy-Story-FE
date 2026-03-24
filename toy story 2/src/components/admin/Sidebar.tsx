import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Tag, Percent, Layers, Ticket, Warehouse, BookOpen, List } from 'lucide-react';
import { ROUTES } from '../../routes/routePaths';
import { useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const navLinks = isAdmin ? [
    { to: ROUTES.ADMIN_DASHBOARD, icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: ROUTES.ADMIN_PRODUCTS, icon: <ShoppingBag size={20} />, label: 'Products' },
    { to: ROUTES.ADMIN_BRANDS, icon: <Tag size={20} />, label: 'Brands' },
    { to: ROUTES.ADMIN_SETS, icon: <Layers size={20} />, label: 'Sets' },
    { to: ROUTES.ADMIN_WAREHOUSE, icon: <Warehouse size={20} />, label: 'Warehouse' },
    { to: ROUTES.ADMIN_STAFF, icon: <Users size={20} />, label: 'Staff' },
    { to: ROUTES.ADMIN_VOUCHERS, icon: <Ticket size={20} />, label: 'Vouchers' },
    { to: ROUTES.ADMIN_PROMOTIONS, icon: <Percent size={20} />, label: 'Promotions' },
    { to: ROUTES.ADMIN_ARTICLES, icon: <BookOpen size={20} />, label: 'Articles' },
    { to: ROUTES.ADMIN_ARTICLE_CATEGORIES, icon: <List size={20} />, label: 'Categories' },
  ] : [
    { to: ROUTES.STAFF_DASHBOARD, icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: ROUTES.STAFF_PRODUCTS, icon: <ShoppingBag size={20} />, label: 'Products' },
    { to: ROUTES.STAFF_BRANDS, icon: <Tag size={20} />, label: 'Brands' },
    { to: ROUTES.STAFF_SETS, icon: <Layers size={20} />, label: 'Sets' },
    { to: ROUTES.STAFF_WAREHOUSE, icon: <Warehouse size={20} />, label: 'Warehouse' },
    { to: ROUTES.STAFF_VOUCHERS, icon: <Ticket size={20} />, label: 'Vouchers' },
    { to: ROUTES.STAFF_PROMOTIONS, icon: <Percent size={20} />, label: 'Promotions' },
    { to: ROUTES.STAFF_ARTICLES, icon: <BookOpen size={20} />, label: 'Articles' },
    { to: ROUTES.STAFF_ARTICLE_CATEGORIES, icon: <List size={20} />, label: 'Categories' },
  ];

  return (
    <div className="w-64 bg-white flex flex-col flex-shrink-0 border-r border-gray-200 font-['Red_Hat_Display']">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-black rounded-md transition-colors ${
                isActive
                  ? 'bg-red-100 text-red-700 font-black'
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
          className="w-full bg-red-600 text-white text-center font-black py-2 px-4 rounded-md hover:bg-red-700 transition-colors no-underline"
        >
          Home page
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
