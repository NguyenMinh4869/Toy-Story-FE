import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Tag, Percent, Layers, Warehouse, List, BookOpen, Album, Truck } from 'lucide-react';
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
        label: 'Tổng quan'
      },
    ];

    // Products management is ADMIN-ONLY (Staff only manages warehouse products)
    if (effectiveMode === 'admin') {
      baseLinks.push({
        to: ROUTES.ADMIN_PRODUCTS,
        icon: <ShoppingBag size={20} />,
        label: 'Sản phẩm'
      });
    }

    // View-only pages for Staff, full access for Admin
    baseLinks.push(
      {
        to: effectiveMode === 'admin' ? ROUTES.ADMIN_BRANDS : ROUTES.STAFF_BRANDS,
        icon: <Tag size={20} />,
        label: 'Thương hiệu'
      },
      {
        to: effectiveMode === 'admin' ? ROUTES.ADMIN_SETS : ROUTES.STAFF_SETS,
        icon: <Layers size={20} />,
        label: 'Bộ sản phẩm'
      },
      {
        to: effectiveMode === 'admin' ? ROUTES.ADMIN_WAREHOUSE : ROUTES.STAFF_WAREHOUSE,
        icon: <Warehouse size={20} />,
        label: 'Kho'
      },
      {
        to: effectiveMode === 'admin' ? ROUTES.ADMIN_ORDERS : ROUTES.STAFF_ORDERS,
        icon: <List size={20} />,
        label: 'Đơn hàng'
      }
    );

    // Staff management is ADMIN-ONLY
    if (effectiveMode === 'admin') {
      baseLinks.push({
        to: ROUTES.ADMIN_STAFF,
        icon: <Users size={20} />,
        label: 'Nhân viên'
      });
    }

    baseLinks.push({
      to: effectiveMode === 'admin' ? ROUTES.ADMIN_PROMOTIONS : ROUTES.STAFF_PROMOTIONS,
      icon: <Percent size={20} />,
      label: 'Khuyến mãi'
    });

    baseLinks.push(
      {
        to: effectiveMode === 'admin' ? ROUTES.ADMIN_ARTICLES : ROUTES.STAFF_ARTICLES,
        icon: <BookOpen size={20} />,
        label: 'Bài viết'
      },
      {
        to: effectiveMode === 'admin' ? ROUTES.ADMIN_ARTICLE_CATEGORIES : ROUTES.STAFF_ARTICLE_CATEGORIES,
        icon: <List size={20} />,
        label: 'Danh mục bài viết'
      }
    );

    baseLinks.push({
      to: effectiveMode === 'admin' ? ROUTES.ADMIN_EVENT : ROUTES.STAFF_EVENT,
      icon: <Album size={20} />,
      label: 'Lịch sử thay đổi'
    });

    baseLinks.push({
      to: effectiveMode === 'admin' ? ROUTES.ADMIN_TRANSFER : ROUTES.STAFF_TRANSFER,
      icon: <Truck size={20} />,
      label: 'Lịch sử chuyển kho'
    });

    return baseLinks;
  };

  const navLinks = getNavLinks();

  const themeColors = {
    activeBg: 'bg-red-100',
    activeText: 'text-red-700',
    buttonBg: 'bg-red-600',
    buttonHover: 'hover:bg-red-700'
  };

  return (
    <div className="w-64 bg-white flex flex-col flex-shrink-0 border-r border-gray-200">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm !font-black rounded-md transition-colors ${isActive
                ? `${themeColors.activeBg} ${themeColors.activeText} !font-black`
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
          className={`w-full ${themeColors.buttonBg} text-white text-center !font-black py-2 px-4 rounded-md ${themeColors.buttonHover} transition-colors no-underline block`}
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
