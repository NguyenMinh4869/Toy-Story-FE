import React from 'react'
import { Grid, List } from 'lucide-react'
import { ProductGridCard } from './ProductGridCard'
import type { ViewProductDto } from '../../types/ProductDTO'

interface ProductGridProps {
  products: ViewProductDto[]
  totalProducts: number
  isLoading?: boolean
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
  sortBy?: string
  onSortChange?: (sort: string) => void
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  totalProducts,
  isLoading = false,
  viewMode = 'grid',
  onViewModeChange,
  sortBy = 'default',
  onSortChange,
}) => {
  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-[17px] border border-gray-200 animate-pulse">
          <div className="h-[240px] bg-gray-200 rounded-t-[17px]" />
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
            <div className="h-4 bg-gray-200 rounded mb-4 w-1/2" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex-1">
      {/* Header with view controls */}
      <div className="flex items-center justify-between mb-6">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-3">
          <span className="font-sansation text-[12px] text-black">Kiểu xem</span>
          <button
            onClick={() => onViewModeChange?.('grid')}
            className={`p-1.5 rounded cursor-pointer border-none ${
              viewMode === 'grid' ? 'bg-gray-200' : 'bg-transparent hover:bg-gray-100'
            }`}
            aria-label="Grid view"
          >
            <Grid size={16} className="text-black" />
          </button>
          <button
            onClick={() => onViewModeChange?.('list')}
            className={`p-1.5 rounded cursor-pointer border-none ${
              viewMode === 'list' ? 'bg-gray-200' : 'bg-transparent hover:bg-gray-100'
            }`}
            aria-label="List view"
          >
            <List size={16} className="text-black" />
          </button>
        </div>

        {/* Product Count */}
        <span className="font-sansation text-[12px] text-black">
          {totalProducts} products
        </span>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="font-sansation text-[12px] text-black">Sắp xếp theo:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="font-sansation text-[12px] text-black bg-white border border-gray-200 rounded px-3 py-1.5 cursor-pointer outline-none focus:border-[#ab0007]"
          >
            <option value="default">Mặc định</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="name-asc">Tên: A-Z</option>
            <option value="name-desc">Tên: Z-A</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-sansation text-[16px] text-gray-500 mb-2">
            Không tìm thấy sản phẩm nào
          </p>
          <p className="font-sansation text-[12px] text-gray-400">
            Vui lòng thử lại với bộ lọc khác
          </p>
        </div>
      ) : (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
          {products.map((product) => (
            <ProductGridCard
              key={product.productId}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductGrid
