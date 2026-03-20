import React, { useState, useEffect } from 'react'
import { FilterSidebar, ProductGrid, Pagination } from '../components/productpage'
import { BreadcrumbHeader } from '../components/BreadcrumbHeader'
import { getCustomerFilterProducts } from '../services/productService'
import type { ViewProductDto } from '../types/ProductDTO'

// Breadcrumb items for the products page
const breadcrumbItems = [
  { label: 'Sản phẩm' },
]

const PRODUCTS_PER_PAGE = 12

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

  // Filter criteria state
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>([])
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([])


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

  // filter and sort products when criteria or sortBy changes
  useEffect(() => {
    let result = [...products]

    // 1. Filter by Price
    if (selectedPriceRanges.length > 0) {
      result = result.filter(product => {
        const price = product.price || 0
        return selectedPriceRanges.some(range => {
          if (range === 'under-200k') return price < 200000
          if (range === '200k-500k') return price >= 200000 && price <= 500000
          if (range === '500k-1m') return price >= 500000 && price <= 1000000
          if (range === '1m-2m') return price >= 1000000 && price <= 2000000
          if (range === 'above-2m') return price > 2000000
          return true
        })
      })
    }

    // 2. Filter by Age
    if (selectedAgeRanges.length > 0) {
      result = result.filter(product => {
        const age = product.ageRangeValue // 0 | 1 | 2 | 3 | 4
        return selectedAgeRanges.some(range => {
          if (range === '0-12-months') return age === 0 || age === 1
          if (range === '1-3') return age === 2
          if (range === '3-6') return age === 3
          if (range === '6-12') return age === 4
          if (range === '12-plus') return age === 4 // Backend limit
          return true
        })
      })
    }

    // 3. Filter by Brand
    if (selectedBrandIds.length > 0) {
      result = result.filter(product => {
        return selectedBrandIds.includes(String(product.brandId))
      })
    }

    // 4. Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
        break
      case 'price-desc':
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
        break
      case 'name-asc':
        result.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
        break
      case 'name-desc':
        result.sort((a, b) => (b.name ?? '').localeCompare(a.name ?? ''))
        break
      default:
        // Keep as is or add default sorting
        break
    }

    setFilteredProducts(result)
    setCurrentPage(1)
  }, [products, sortBy, selectedPriceRanges, selectedAgeRanges, selectedBrandIds])


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
    setSelectedPriceRanges(priceRanges)
  }

  const handleAgeChange = (ageRanges: string[]) => {
    setSelectedAgeRanges(ageRanges)
  }

  const handleBrandChange = (brands: string[]) => {
    setSelectedBrandIds(brands)
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
      <div className="max-w-[1200px] mx-auto py-8">
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
