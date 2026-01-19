import React from 'react'
import { Link } from 'react-router-dom'
import { Search, User, ShoppingBag, ChevronDown } from 'lucide-react'

const Header: React.FC = () => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    e.currentTarget.style.display = 'none'
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
          <Link to="/login" className="flex items-center gap-2 cursor-pointer no-underline text-inherit">
            <User size={22} stroke="white" strokeWidth={2} className="w-[22px] h-[22px] flex-shrink-0" />
            <span className="font-tilt-warp text-xs text-white">Đăng nhập</span>
          </Link>
          <Link to="/cart" className="flex items-center gap-2 cursor-pointer no-underline text-inherit">
            <ShoppingBag size={22} stroke="white" strokeWidth={2} className="w-[22px] h-[22px] flex-shrink-0" />
            <span className="font-tilt-warp text-xs text-white">Giỏ hàng</span>
          </Link>
        </div>
      </div>
      <nav className="max-w-[1800px] mx-auto flex gap-12 items-center justify-center font-tilt-warp text-xs max-xl:gap-6 max-xl:flex-wrap">
        <a href="#exclusive" className="text-white no-underline flex items-center gap-2 hover:opacity-80">ĐỘC QUYỀN ONLINE</a>
        <a href="#gundam" className="text-white no-underline flex items-center gap-2 hover:opacity-80">
          GUNDAM
          <ChevronDown size={17} stroke="white" strokeWidth={2} className="w-[17px] h-2 flex-shrink-0" />
        </a>
        <a href="#new" className="text-white no-underline flex items-center gap-2 hover:opacity-80">HÀNG MỚI</a>
        <a href="#products" className="text-white no-underline flex items-center gap-2 hover:opacity-80">
          SẢN PHẨM
          <ChevronDown size={17} stroke="white" strokeWidth={2} className="w-[17px] h-2 flex-shrink-0" />
        </a>
        <a href="#promotion" className="text-white no-underline flex items-center gap-2 hover:opacity-80">KHUYẾN MÃI</a>
        <a href="#brands" className="text-white no-underline flex items-center gap-2 hover:opacity-80">THƯƠNG HIỆU</a>
        <a href="#guide" className="text-white no-underline flex items-center gap-2 hover:opacity-80">CẨM NANG MUA HÀNG</a>
      </nav>
    </header>
  )
}

export default Header
