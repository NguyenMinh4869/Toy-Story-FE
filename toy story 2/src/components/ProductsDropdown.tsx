import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice'
import { getCategories } from '../services/categoryService'
import { getActiveProducts } from '../services/productService'
import { 
  Zap, 
  Car, 
  Gamepad2, 
  Baby, 
  Utensils, 
  Sparkles, 
  Box, 
  Music, 
  Bath, 
  Ghost,
  Star,
  Flame
} from 'lucide-react'
import type { ViewCategoryDto } from '../types/CategoryDTO'
import type { ViewProductDto } from '../types/ProductDTO'

const FEATURED_BG = "https://www.figma.com/api/mcp/asset/05b9a086-cba0-4da8-80e9-b1ff25c8c382"
const PRODUCT_PLACEHOLDER = "https://www.figma.com/api/mcp/asset/1b629d68-a06d-4580-8dbe-46fefd9ce76a"

interface ProductsDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export const ProductsDropdown: React.FC<ProductsDropdownProps> = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState<ViewCategoryDto[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<ViewProductDto[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories and featured products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch categories
        const categoriesData = await getCategories()
        setCategories(categoriesData)
        
        // Set first category as selected by default
        if (categoriesData.length > 0) {
          setSelectedCategoryId(categoriesData[0].categoryId ?? null)
        }

        // Try to fetch products, but don't fail if it errors
        try {
          const productsData = await getActiveProducts()
          // Get first 2 products as featured
          setFeaturedProducts(productsData.slice(0, 2))
        } catch (productError) {
          console.error('Error fetching products:', productError)
          // Continue without products
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error)
        setError('Không thể tải dữ liệu')
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  if (!isOpen) return null

  // Calculate original price (assuming 30% discount for demo)
  const getOriginalPrice = (price: number) => {
    return price / 0.7
  }

  // Map category names to icons
  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('siêu nhân') || n.includes('robot')) return <Zap size={16} />
    if (n.includes('mô hình') || n.includes('đua')) return <Car size={16} />
    if (n.includes('khủng long')) return <Ghost size={16} />
    if (n.includes('búp bê')) return <Baby size={16} />
    if (n.includes('bếp')) return <Utensils size={16} />
    if (n.includes('trang điểm')) return <Sparkles size={16} />
    if (n.includes('sưu tập')) return <Box size={16} />
    if (n.includes('âm nhạc')) return <Music size={16} />
    if (n.includes('tắm')) return <Bath size={16} />
    return <Gamepad2 size={16} />
  }

  return (
    <div 
      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
    >
      <div className="bg-white rounded-[26px] shadow-xl overflow-hidden flex" style={{ width: '800px' }}>
        {/* Left Column - Categories */}
        <div 
          className="w-[220px] py-4 px-3 border-r border-[#885d5d]/10 bg-[#fdfdfd] relative"
          style={{ 
            backgroundImage: `radial-gradient(#885d5d10 1px, transparent 1px)`,
            backgroundSize: '12px 12px'
          }}
        >
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 py-2 px-3 animate-pulse">
                <div className="w-[24px] h-[24px] bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-24" />
              </div>
            ))
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-red-500 text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-xs text-blue-500 underline"
              >
                Thử lại
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500 text-sm">Không có danh mục</p>
            </div>
          ) : (
            categories.map((category) => (
              <Link
                key={category.categoryId}
                to="/products"
                onClick={onClose}
                onMouseEnter={() => setSelectedCategoryId(category.categoryId ?? null)}
                className={`flex items-center gap-3 py-2 px-3 rounded-[18px] no-underline transition-all duration-200 ${
                  selectedCategoryId === category.categoryId 
                    ? 'bg-white shadow-sm ring-1 ring-red-100/50 scale-[1.02]' 
                    : 'hover:bg-red-50/30'
                }`}
              >
              
                <span className={`transition-colors ${selectedCategoryId === category.categoryId ? 'text-[#af0000]' : 'text-gray-400'}`}>
                  {getCategoryIcon(category.name || '')}
                </span>
                <span className="font-unbounded text-[10px] text-black pt-0.5">
                  {category.name}
                </span>
              </Link>
            ))
          )}
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
          <div className="bg-[#af0000] rounded-[14px] py-2 px-4 flex items-center justify-center gap-3 mb-4 shadow-sm">
            <Flame size={14} className="text-yellow-400 animate-pulse fill-yellow-400" />
            <span className="font-tilt-warp text-[12px] text-white tracking-widest">SẢN PHẨM NỔI BẬT</span>
            <Star size={14} className="text-yellow-400 animate-bounce fill-yellow-400" />
          </div>

          {/* Products Grid */}
          <div className="flex gap-3 justify-center">
            {isLoading ? (
              // Loading skeleton for products
              Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="bg-white rounded-[16px] border border-gray-200 p-3 w-[140px] animate-pulse">
                  <div className="w-full h-[100px] bg-gray-200 rounded-lg mb-2" />
                  <div className="h-3 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Link
                  key={product.productId}
                  to={`/product/${product.productId}`}
                  onClick={onClose}
                  className="bg-white rounded-[16px] border border-[#463535]/20 p-3 w-[140px] no-underline block hover:shadow-md transition-shadow"
                >
                  {/* Discount Badge */}
                  <div className="relative">
                  
                    <img 
                      src={product.imageUrl || PRODUCT_PLACEHOLDER} 
                      alt={product.name || 'Product'}
                      className="w-full h-[100px] object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = PRODUCT_PLACEHOLDER
                      }}
                    />
                  </div>
                  
                  {/* Product Info */}
                  <p className="font-unbounded text-[10px] text-black mt-2 mb-2 line-clamp-2 leading-tight">
                    {product.name}
                  </p>
                  
                  {/* Price */}
                  <p className="font-unbounded text-[12px] text-[#ff0000] text-center mb-1">
                    {formatPrice(product.price ?? 0)}
                  </p>
                  
                  {/* Original Price */}
                  <p className="font-unbounded text-[9px] text-[#725656] text-center line-through">
                    {formatPrice(getOriginalPrice(product.price ?? 0))}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Không có sản phẩm</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsDropdown
