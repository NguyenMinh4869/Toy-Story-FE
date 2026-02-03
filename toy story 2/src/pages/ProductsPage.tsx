import React, { useState, useEffect } from 'react'
import { FilterSidebar, ProductGrid, Pagination } from '../components/productpage'
import { BreadcrumbHeader } from '../components/BreadcrumbHeader'
import { getCustomerFilterProducts } from '../services/productService'
import type { ViewProductDto } from '../types/ProductDTO'

// Breadcrumb items for the products page
const breadcrumbItems = [
  { label: 'Sản phẩm' },
]

const PRODUCTS_PER_PAGE = 8

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ViewProductDto[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ViewProductDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  
  // View and sort state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('default')

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getCustomerFilterProducts()
        setProducts(data)
        setFilteredProducts(data)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Sort products when sortBy changes
  useEffect(() => {
    let sorted = [...filteredProducts]
    
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
        break
      case 'price-desc':
        sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
        break
      case 'name-asc':
        sorted.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
        break
      case 'name-desc':
        sorted.sort((a, b) => (b.name ?? '').localeCompare(a.name ?? ''))
        break
      default:
        // Keep original order
        sorted = [...products]
        break
    }
    
    setFilteredProducts(sorted)
    setCurrentPage(1) // Reset to first page when sorting changes
  }, [sortBy])

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  // Handle filter changes
  const handleCategoryChange = (categories: string[]) => {
    console.log('Categories:', categories)
    // TODO: Implement category filtering
  }

  const handlePriceChange = (priceRanges: string[]) => {
    console.log('Price ranges:', priceRanges)
    // TODO: Implement price filtering
  }

  const handleAgeChange = (ageRanges: string[]) => {
    console.log('Age ranges:', ageRanges)
    // TODO: Implement age filtering
  }

  const handleBrandChange = (brands: string[]) => {
    console.log('Brands:', brands)
    // TODO: Implement brand filtering
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of product grid
    window.scrollTo({ top: 200, behavior: 'smooth' })
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <BreadcrumbHeader items={breadcrumbItems} />

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-sansation text-[14px]">{error}</p>
          </div>
        )}

        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <FilterSidebar
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
            onAgeChange={handleAgeChange}
            onBrandChange={handleBrandChange}
          />

          {/* Right Content - Product Grid */}
          <div className="flex-1">
            <ProductGrid
              products={currentProducts}
              totalProducts={filteredProducts.length}
              isLoading={isLoading}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Pagination */}
            {!isLoading && filteredProducts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
