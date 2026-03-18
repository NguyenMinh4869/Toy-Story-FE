import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routePaths";
import {
  User,
  ShoppingBag,
  ChevronDown,
  LogOut,
  UserCircle,
  LayoutDashboard,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";
import ProductsDropdown from "./ProductsDropdown";
import { LOGO_TOY_STORY } from "../constants/imageAssets";

const Header: React.FC = () => {
  const { getTotalItems, openCart } = useCart();
  const { isAuthenticated, user, role, logout } = useAuth();
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement>,
  ): void => {
    e.currentTarget.style.display = "none";
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const handleLogout = () => {
    setIsUserDropdownOpen(false);
    logout();
  };

  return (
    <header className="bg-[#ab0007] w-full px-[38px] py-[19px] text-white">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center no-underline text-inherit">
          <img
            src={LOGO_TOY_STORY}
            alt="TOY STORY Logo"
            className="h-[47px] w-auto"
            onError={handleImageError}
          />
          <div className="font-tilt-warp text-2xl font-bold text-white hidden [img[style*='display:_none']~&]:block">
            TOYSTORY
          </div>
        </Link>
        <div className="flex flex-1 justify-center">
          <nav className="flex gap-8 items-center font-tilt-warp text-xs">

            <Link to={ROUTES.PRODUCTS} className="text-white hover:opacity-80">
              SẢN PHẨM
            </Link>
            <Link to="/sets" className="text-white hover:opacity-80">
              BỘ SƯU TẬP
            </Link>
            <Link to="/promotion" className="text-white hover:opacity-80">
              KHUYẾN MÃI
            </Link>
            <Link to={ROUTES.BRANDS} className="text-white hover:opacity-80">
              THƯƠNG HIỆU
            </Link>

          </nav>
        </div>

        <nav className="flex gap-8 items-center font-tilt-warp text-xs">
          {isAuthenticated ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer bg-transparent border-none text-white hover:opacity-80 transition-opacity"
              >
                <User
                  size={22}
                  stroke="white"
                  strokeWidth={2}
                  className="w-[22px] h-[22px] flex-shrink-0"
                />
                <span className="font-tilt-warp text-xs text-white">
                  Xin chào, {user?.name || "Thành viên"}
                </span>
                <ChevronDown
                  size={16}
                  stroke="white"
                  strokeWidth={2}
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${isUserDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* Management link for Admin and Staff */}
                  {(role === "Admin" || role === "Staff") && (
                    <>
                      <Link
                        to={
                          role === "Admin"
                            ? ROUTES.ADMIN_DASHBOARD
                            : ROUTES.STAFF_DASHBOARD
                        }
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-blue-700 hover:bg-blue-50 transition-colors no-underline"
                      >
                        <LayoutDashboard size={18} className="flex-shrink-0" />
                        <span className="font-tilt-warp text-sm">Quản lí</span>
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                    </>
                  )}
                  <Link
                    to={ROUTES.PROFILE}
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <UserCircle size={18} className="flex-shrink-0" />
                    <span className="font-tilt-warp text-sm">
                      Trang cá nhân
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors bg-transparent border-none cursor-pointer text-left"
                  >
                    <LogOut size={18} className="flex-shrink-0" />
                    <span className="font-tilt-warp text-sm">Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="text-white hover:opacity-80">
                Đăng nhập
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="text-white hover:opacity-80"
              >
                Đăng ký
              </Link>
            </>
          )}

          <button
            onClick={openCart}
            className="flex items-center gap-2 bg-transparent border-none"
          >
            <ShoppingBag size={22} stroke="white" strokeWidth={2} />
            <span>
              Giỏ hàng {getTotalItems() > 0 && `(${getTotalItems()})`}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
