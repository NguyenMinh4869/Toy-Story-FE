/**
 * BrandPage Component
 * Main page for displaying all brands grouped alphabetically
 */

import React, { useState, useEffect } from 'react'
import { Loader2, AlertCircle, ImageOff } from 'lucide-react'
import { getActiveBrands } from '../services/brandService'
import { BrandFilter } from '../components/brands/BrandFilter'
import { BrandSection } from '../components/brands/BrandSection'
import { groupBrandsByLetter, getAvailableLetters } from '../utils/brandUtils'
import { BreadcrumbHeader } from '../components/BreadcrumbHeader'
import type { ViewBrandDto } from '../types/BrandDTO'
import type { GroupedBrands } from '../utils/brandUtils'

export const BrandPage: React.FC = () => {
  const [brands, setBrands] = useState<ViewBrandDto[]>([])
  const [groupedBrands, setGroupedBrands] = useState<GroupedBrands[]>([])
  const [availableLetters, setAvailableLetters] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch brands on component mount
   */
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch active brands from API
        const fetchedBrands = await getActiveBrands()
        
        // Group brands alphabetically
        const grouped = groupBrandsByLetter(fetchedBrands)
        const letters = getAvailableLetters(grouped)

        setBrands(fetchedBrands)
        setGroupedBrands(grouped)
        setAvailableLetters(letters)
      } catch (err) {
        console.error('Error fetching brands:', err)
        setError(
          err instanceof Error 
            ? err.message 
            : 'Failed to load brands. Please try again later.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchBrands()
  }, [])

  /**
   * Loading State
   */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading brands...</p>
        </div>
      </div>
    )
  }

  /**
   * Error State
   */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold 
              hover:bg-red-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  /**
   * Empty State
   */
  if (brands.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No Brands Available</h2>
          <p className="text-gray-600">Check back later for new brands!</p>
        </div>
      </div>
    )
  }

  /**
   * Main Content
   */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Header */}
      <BreadcrumbHeader items={[{ label: 'Thương hiệu' }]} />

      {/* Sticky Filter Navigation */}
      <BrandFilter availableLetters={availableLetters} />

      {/* Brand Sections */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {groupedBrands.map((group) => (
          <BrandSection key={group.letter} group={group} />
        ))}
      </main>

      {/* Empty State for brands with no images */}
      {brands.every(b => !b.imageUrl) && (
        <div className="flex flex-col items-center justify-center py-16">
          <ImageOff className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Không có thương hiệu có hình ảnh</h2>
          <p className="text-gray-500">Hiện tại chưa có thương hiệu nào có hình ảnh để hiển thị.</p>
        </div>
      )}

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-red-600 text-white p-4 rounded-full shadow-lg 
          hover:bg-red-700 transition-all duration-200 hover:scale-110 z-30"
        aria-label="Scroll to top"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  )
}
