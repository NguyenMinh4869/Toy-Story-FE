import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../routes/routePaths'
import { Search, User, ShoppingBag, ChevronDown, LogOut, UserCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../hooks/useAuth'
import ProductsDropdown from './ProductsDropdown'

const Header: React.FC = () => {
  const { getTotalItems, openCart } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    e.currentTarget.style.display = 'none'
  }

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
    }

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserDropdownOpen])

  const handleLogout = () => {
    setIsUserDropdownOpen(false)
    logout()
  }

  return (
    <header className="bg-[#ab0007] relative w-full px-[38px] py-[19px] text-white">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between mb-[30px]">
        <Link to="/" className="relative h-[47px] flex items-center no-underline text-inherit">
          <img 
            src="https://www.figma.com/api/mcp/asset/a3292b82-feb6-483d-a4f2-619ec8b796dd" 
            alt="Logo" 
            className="h-[47px] w-auto"
            onError={handleImageError}
          />
          <div className="font-tilt-warp text-2xl font-bold text-white hidden [img[style*='display:_none']~&]:block">TOYSTORY</div>
        </Link>
        <div className="flex-1 max-w-[440px] mx-5">
          <div className="relative bg-white border border-[#536179] rounded-[111px] h-10 flex items-center px-4">
            <Search className="w-5 h-5 mr-4 flex-shrink-0" size={20} stroke="rgba(0,0,0,0.41)" />
            <input 
              type="text" 
              placeholder="Nhập đồ chơi bạn muốn" 
              className="flex-1 border-none outline-none font-sansation text-xs text-[rgba(0,0,0,0.41)] placeholder:text-[rgba(0,0,0,0.41)]"
            />
          </div>
        </div>
        <div className="flex gap-6 items-center">
          {/* Conditional Auth UI */}
          {isAuthenticated && user ? (
            // Authenticated State - User Profile Dropdown
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer bg-transparent border-none text-white hover:opacity-80 transition-opacity"
              >
                <User size={22} stroke="white" strokeWidth={2} className="w-[22px] h-[22px] flex-shrink-0" />
                <span className="font-tilt-warp text-xs text-white">
                  Xin chào, {user.name || 'Người dùng'}
                </span>
                <ChevronDown 
                  size={16} 
                  stroke="white" 
                  strokeWidth={2} 
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    to={ROUTES.PROFILE}
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors no-underline"
                  >
                    <UserCircle size={18} className="flex-shrink-0" />
                    <span className="font-tilt-warp text-sm">Trang cá nhân</span>
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
            // Guest State - Login and Register Buttons
            <>
              <Link to={ROUTES.LOGIN} className="flex items-center gap-2 cursor-pointer no-underline text-inherit hover:opacity-80 transition-opacity">
                <User size={22} stroke="white" strokeWidth={2} className="w-[22px] h-[22px] flex-shrink-0" />
                <span className="font-tilt-warp text-xs text-white">Đăng nhập</span>
              </Link>
              <Link to={ROUTES.REGISTER} className="flex items-center gap-2 cursor-pointer no-underline text-inherit hover:opacity-80 transition-opacity">
                <User size={22} stroke="white" strokeWidth={2} className="w-[22px] h-[22px] flex-shrink-0" />
                <span className="font-tilt-warp text-xs text-white">Đăng ký</span>
              </Link>
            </>
          )}
          
          <button 
            onClick={openCart}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-none"
          >
            <ShoppingBag size={22} stroke="white" strokeWidth={2} className="w-[22px] h-[22px] flex-shrink-0" />
            <span className="font-tilt-warp text-xs text-white">
              Giỏ hàng {getTotalItems() > 0 && `(${getTotalItems()})`}
            </span>
          </button>
        </div>
      </div>
      <nav className="max-w-[1800px] mx-auto flex gap-12 items-center justify-center font-tilt-warp text-xs max-xl:gap-6 max-xl:flex-wrap relative">
        <a href="#exclusive" className="text-white no-underline flex items-center gap-2 hover:opacity-80">ĐỘC QUYỀN ONLINE</a>
        <a href="#gundam" className="text-white no-underline flex items-center gap-2 hover:opacity-80">
          GUNDAM
          <ChevronDown size={17} stroke="white" strokeWidth={2} className="w-[17px] h-2 flex-shrink-0" />
        </a>
        <a href="#new" className="text-white no-underline flex items-center gap-2 hover:opacity-80">HÀNG MỚI</a>
        
        {/* Products Dropdown Trigger */}
        <div 
          className="relative"
          onMouseEnter={() => setIsProductsDropdownOpen(true)}
          onMouseLeave={() => setIsProductsDropdownOpen(false)}
        >
          <button 
            className="text-white no-underline flex items-center gap-2 hover:opacity-80 bg-transparent border-none cursor-pointer font-tilt-warp text-xs"
            onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
          >
            SẢN PHẨM
            <ChevronDown 
              size={17} 
              stroke="white" 
              strokeWidth={2} 
              className={`w-[17px] h-2 flex-shrink-0 transition-transform ${isProductsDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          
          <ProductsDropdown 
            isOpen={isProductsDropdownOpen} 
            onClose={() => setIsProductsDropdownOpen(false)} 
          />
        </div>
        
        <Link to="/promotion" className="text-white no-underline flex items-center gap-2 hover:opacity-80">KHUYẾN MÃI</Link>
        <Link to={ROUTES.BRANDS} className="text-white no-underline flex items-center gap-2 hover:opacity-80">THƯƠNG HIỆU</Link>
        <Link to={ROUTES.CAM_NANG} className="text-white no-underline flex items-center gap-2 hover:opacity-80">CẨM NANG MUA HÀNG</Link>
      </nav>
    </header>
  )
}

export default Header
