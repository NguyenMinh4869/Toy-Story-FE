import React from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice'

// Asset URLs from Figma
const CATEGORY_ICON = "https://www.figma.com/api/mcp/asset/10c04112-c747-4f08-9809-fa8c5dc21525"
const FEATURED_BG = "https://www.figma.com/api/mcp/asset/05b9a086-cba0-4da8-80e9-b1ff25c8c382"
const PRODUCT_IMAGE = "https://www.figma.com/api/mcp/asset/1b629d68-a06d-4580-8dbe-46fefd9ce76a"
const DISCOUNT_BADGE = "https://www.figma.com/api/mcp/asset/435fa979-5a5c-4f4b-b32a-e5e6318ef070"
const DECOR_LEFT = "https://www.figma.com/api/mcp/asset/2577a437-6eb6-4b9c-897c-cf94e79a5b2f"
const DECOR_RIGHT = "https://www.figma.com/api/mcp/asset/a741473c-4a12-4bc2-a7b1-01e25cd2c1ef"

// Category data
const categories = [
  { id: 1, name: 'ĐỒ CHƠI LẮP GHÉP', icon: CATEGORY_ICON },
  { id: 2, name: 'ĐỒ DÙNG CHO BÉ', icon: CATEGORY_ICON },
  { id: 3, name: 'ĐỒ CHƠI PHƯƠNG TIỆN', icon: CATEGORY_ICON },
  { id: 4, name: 'XE ĐẠP & SCOOTER', icon: CATEGORY_ICON },
  { id: 5, name: 'ĐỒ CHƠI THEO PHIM', icon: CATEGORY_ICON },
  { id: 6, name: 'ĐỒ CHƠI ANIME', icon: CATEGORY_ICON },
  { id: 7, name: 'ĐỒ CHƠI GIÁO DỤC', icon: CATEGORY_ICON },
  { id: 8, name: 'ĐỒ CHƠI VẬN ĐỘNG', icon: CATEGORY_ICON },
  { id: 9, name: 'ĐỒ CHƠI NHÀ BẾP', icon: CATEGORY_ICON },
]

// Subcategory data
const subcategories = [
  { id: 1, name: 'SUPER DEFORMED', highlight: true },
  { id: 2, name: 'GUNDAM Cỡ Lớn' },
  { id: 3, name: 'GUNDAM Cỡ Lớn' },
  { id: 4, name: 'GUNDAM Cỡ Lớn' },
  { id: 5, name: 'GUNDAM Cỡ Lớn' },
  { id: 6, name: 'GUNDAM Cỡ Lớn' },
  { id: 7, name: 'GUNDAM Cỡ Lớn' },
  { id: 8, name: 'GUNDAM Cỡ Lớn' },
]

// Featured products data
const featuredProducts = [
  {
    id: 1,
    name: 'Đồ chơi lắp ráp Ninja go phiên bản mới nhất ....',
    price: 1032000,
    originalPrice: 1720000,
    image: PRODUCT_IMAGE,
    discount: 70,
  },
  {
    id: 2,
    name: 'Đồ chơi lắp ráp Ninja go phiên bản mới nhất ....',
    price: 1032000,
    originalPrice: 1720000,
    image: PRODUCT_IMAGE,
    discount: 70,
  },
]

interface ProductsDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export const ProductsDropdown: React.FC<ProductsDropdownProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div 
      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
    >
      <div className="bg-white rounded-[26px] shadow-xl overflow-hidden flex" style={{ width: '800px' }}>
        {/* Left Column - Categories */}
        <div className="w-[220px] py-4 px-3 border-r border-gray-100">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to="/products"
              onClick={onClose}
              className={`flex items-center gap-3 py-2 px-3 rounded-[18px] no-underline transition-colors ${
                index === 0 ? 'bg-[rgba(244,130,130,0.18)]' : 'hover:bg-gray-50'
              }`}
            >
              <img 
                src={category.icon} 
                alt="" 
                className="w-[24px] h-[24px] object-cover flex-shrink-0"
              />
              <span className="font-unbounded text-[10px] text-black">
                {category.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Middle Column - Subcategories */}
        <div className="w-[180px] py-4 px-4">
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              to="/products"
              onClick={onClose}
              className={`block py-2 no-underline transition-colors hover:text-[#ab0007] ${
                sub.highlight 
                  ? 'font-unbounded text-[12px] text-[#ff0000] font-medium' 
                  : 'font-red-hat text-[12px] text-[#645151]'
              }`}
            >
              {sub.name}
            </Link>
          ))}
        </div>

        {/* Right Column - Featured Products */}
        <div 
          className="flex-1 rounded-[18px] m-2 p-4 overflow-hidden border border-[#885d5d]/30"
          style={{ 
            backgroundImage: `url('${FEATURED_BG}')`,
            backgroundSize: '50px 50px'
          }}
        >
          {/* Header */}
          <div className="bg-[#af0000] rounded-[14px] py-2 px-4 flex items-center justify-center gap-2 mb-4">
            <img src={DECOR_RIGHT} alt="" className="w-[13px] h-[13px]" />
            <span className="font-tilt-warp text-[12px] text-white">SẢN PHẨM NỔI BẬT</span>
            <img src={DECOR_LEFT} alt="" className="w-[13px] h-[13px]" />
          </div>

          {/* Products Grid */}
          <div className="flex gap-3 justify-center">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to="/products"
                onClick={onClose}
                className="bg-white rounded-[16px] border border-[#463535]/20 p-3 w-[140px] no-underline block hover:shadow-md transition-shadow"
              >
                {/* Discount Badge */}
                <div className="relative">
                  <img 
                    src={DISCOUNT_BADGE} 
                    alt="" 
                    className="absolute top-0 left-0 w-[35px] h-[35px] z-10"
                  />
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-[100px] object-cover rounded-lg"
                  />
                </div>
                
                {/* Product Info */}
                <p className="font-unbounded text-[10px] text-black mt-2 mb-2 line-clamp-2 leading-tight">
                  {product.name}
                </p>
                
                {/* Price */}
                <p className="font-unbounded text-[12px] text-[#ff0000] text-center mb-1">
                  {formatPrice(product.price)}
                </p>
                
                {/* Original Price */}
                <p className="font-unbounded text-[9px] text-[#725656] text-center line-through">
                  {formatPrice(product.originalPrice)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsDropdown
