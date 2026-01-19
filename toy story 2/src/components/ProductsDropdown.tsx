import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice'
import { getCategories } from '../services/categoryService'
import { getActiveProducts } from '../services/productService'
import type { ViewCategoryDto } from '../types/CategoryDTO'
import type { ViewProductDto } from '../types/ProductDTO'

// Asset URLs from Figma
const CATEGORY_ICON = "https://www.figma.com/api/mcp/asset/10c04112-c747-4f08-9809-fa8c5dc21525"
const FEATURED_BG = "https://www.figma.com/api/mcp/asset/05b9a086-cba0-4da8-80e9-b1ff25c8c382"
const PRODUCT_PLACEHOLDER = "https://www.figma.com/api/mcp/asset/1b629d68-a06d-4580-8dbe-46fefd9ce76a"
const DISCOUNT_BADGE = "https://www.figma.com/api/mcp/asset/435fa979-5a5c-4f4b-b32a-e5e6318ef070"
const DECOR_LEFT = "https://www.figma.com/api/mcp/asset/2577a437-6eb6-4b9c-897c-cf94e79a5b2f"
const DECOR_RIGHT = "https://www.figma.com/api/mcp/asset/a741473c-4a12-4bc2-a7b1-01e25cd2c1ef"

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

  return (
    <div 
      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
    >
      <div className="bg-white rounded-[26px] shadow-xl overflow-hidden flex" style={{ width: '800px' }}>
        {/* Left Column - Categories */}
        <div className="w-[220px] py-4 px-3 border-r border-gray-100">
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
                className={`flex items-center gap-3 py-2 px-3 rounded-[18px] no-underline transition-colors ${
                  selectedCategoryId === category.categoryId 
                    ? 'bg-[rgba(244,130,130,0.18)]' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <img 
                  src={CATEGORY_ICON} 
                  alt="" 
                  className="w-[24px] h-[24px] object-cover flex-shrink-0"
                />
                <span className="font-unbounded text-[10px] text-black">
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
          <div className="bg-[#af0000] rounded-[14px] py-2 px-4 flex items-center justify-center gap-2 mb-4">
            <img src={DECOR_RIGHT} alt="" className="w-[13px] h-[13px]" />
            <span className="font-tilt-warp text-[12px] text-white">SẢN PHẨM NỔI BẬT</span>
            <img src={DECOR_LEFT} alt="" className="w-[13px] h-[13px]" />
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
                      src={DISCOUNT_BADGE} 
                      alt="" 
                      className="absolute top-0 left-0 w-[35px] h-[35px] z-10"
                    />
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
