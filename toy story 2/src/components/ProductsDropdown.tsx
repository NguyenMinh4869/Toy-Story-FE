import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice'
import { getCategories } from '../services/categoryService'
import { getActiveProducts } from '../services/productService'
import type { ViewCategoryDto } from '../types/CategoryDTO'
import type { ViewProductDto } from '../types/ProductDTO'

import { LucideIcon, Puzzle, Baby, GraduationCap, Car, Blocks, ToyBrick, Rocket, Music, Bath, Sparkles, Tag } from 'lucide-react'

// Icon mapping for categories (Toy Story theme)
const getCategoryIcon = (name: string): LucideIcon => {
  const n = name.toLowerCase()
  if (n.includes('robot') || n.includes('siêu nhân')) return Rocket
  if (n.includes('xe') || n.includes('mô hình')) return Car
  if (n.includes('khủng long') || n.includes('thế giới')) return Sparkles
  if (n.includes('búp bê')) return Baby
  if (n.includes('nhà bếp')) return ToyBrick
  if (n.includes('trang điểm')) return Sparkles
  if (n.includes('sưu tập')) return Blocks
  if (n.includes('âm nhạc')) return Music
  if (n.includes('tắm')) return Bath
  if (n.includes('học tập') || n.includes('giáo dục')) return GraduationCap
  return Puzzle
}

const PRODUCT_PLACEHOLDER = "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=200&auto=format&fit=crop"

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
      <div className="bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden flex border border-[#f5ecec]" style={{ width: '850px' }}>
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
            categories.map((category) => {
              const Icon = getCategoryIcon(category.name || '')
              const isSelected = selectedCategoryId === category.categoryId

              return (
                <Link
                  key={category.categoryId}
                  to="/products"
                  onClick={onClose}
                  onMouseEnter={() => setSelectedCategoryId(category.categoryId ?? null)}
                  className={`flex items-center gap-3 py-2.5 px-4 rounded-[16px] no-underline transition-all group ${isSelected
                    ? 'bg-red-50 text-[#ca002a]'
                    : 'hover:bg-gray-50 text-gray-700'
                    }`}
                >
                  <Icon
                    size={20}
                    className={`flex-shrink-0 ${isSelected ? 'text-[#ca002a]' : 'text-gray-400 group-hover:text-[#ca002a]'}`}
                  />
                  <span className="font-tilt-warp text-[10px] tracking-wide uppercase">
                    {category.name}
                  </span>
                </Link>
              )
            })
          )}
        </div>

        {/* Right Column - Featured Products */}
        <div
          className="flex-1 rounded-[24px] m-2 p-5 overflow-hidden border border-[#ca002a]/10 relative bg-white"
        >
          {/* Decorative Pattern Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#ca002a 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Floating Decorative Elements */}
          <div className="absolute top-20 left-10 opacity-[0.05] -rotate-12 pointer-events-none">
            <Puzzle size={80} className="text-[#ca002a]" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-[0.05] rotate-12 pointer-events-none">
            <Blocks size={80} className="text-[#ca002a]" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
            <Rocket size={150} className="text-[#ca002a]" />
          </div>

          <div className="relative z-[1]">
            {/* Header */}
            <div className="bg-[#ca002a] rounded-2xl py-2.5 px-4 flex items-center justify-center gap-3 mb-6 shadow-sm shadow-red-900/10">
              <Sparkles size={14} className="text-[#ffd900]" />
              <span className="font-tilt-warp text-[13px] text-white tracking-widest uppercase">SẢN PHẨM NỔI BẬT</span>
              <Sparkles size={14} className="text-[#ffd900]" />
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
                    className="bg-white rounded-2xl border border-gray-100 p-4 w-[160px] no-underline block hover:shadow-xl hover:border-[#ca002a]/20 transition-all group"
                  >
                    {/* Discount Badge */}
                    <div className="relative overflow-hidden rounded-xl">
                      <div className="absolute top-2 left-2 bg-[#ca002a] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full z-10 shadow-sm flex items-center gap-1 leading-none">
                        <Tag size={8} />
                        -30%
                      </div>
                      <img
                        src={product.imageUrl || PRODUCT_PLACEHOLDER}
                        alt={product.name || 'Product'}
                        className="w-full h-[120px] object-contain bg-[#f9f9f9] group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = PRODUCT_PLACEHOLDER
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <p className="font-tilt-warp text-[10px] text-[#1a1a1a] mt-3 mb-2 line-clamp-2 leading-snug group-hover:text-[#ca002a] transition-colors">
                      {product.name}
                    </p>

                    {/* Price Row */}
                    <div className="mt-auto space-y-1">
                      <p className="font-tilt-warp text-[12px] text-[#ca002a] text-center font-bold">
                        {formatPrice(product.price ?? 0)}
                      </p>
                      <p className="font-red-hat text-[9px] text-gray-400 text-center line-through opacity-70">
                        {formatPrice(getOriginalPrice(product.price ?? 0))}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Không có sản phẩm</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsDropdown
