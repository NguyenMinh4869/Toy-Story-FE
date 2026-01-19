/**
 * BrandCard Component
 * Displays individual brand card with logo and hover effects
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ViewBrandDto } from '../../types/BrandDTO'

interface BrandCardProps {
  brand: ViewBrandDto
  className?: string
}

export const BrandCard: React.FC<BrandCardProps> = ({ brand, className = '' }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    // Navigate to brand detail page (future implementation)
    navigate(`/brands/${brand.brandId}`)
  }

  // Fallback placeholder image if imageUrl is null
  const [imgError, setImgError] = useState(false)
  const brandImage = brand.imageUrl && !imgError ? brand.imageUrl : ''
  const brandName = brand.name ?? 'Unnamed Brand'

  return (
    <div
      onClick={handleClick}
      className={`group relative bg-white rounded-xl border-2 border-gray-200 overflow-hidden cursor-pointer 
        transition-all duration-300 hover:border-red-600 hover:shadow-xl hover:-translate-y-1 ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick()
        }
      }}
      aria-label={`View ${brandName} products`}
    >
      {/* Image Container */}

      <div className="aspect-square w-full bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
        {brandImage ? (
          <img
            src={brandImage}
            alt={brandName}
            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">No Image</span>
          </div>
        )}
      </div>

      {/* Brand Name Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white font-semibold text-center text-sm truncate">
          {brandName}
        </p>
      </div>

      {/* Status Badge (if inactive) */}
      {brand.status !== 'Active' && (
        <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-md">
          {brand.status}
        </div>
      )}
    </div>
  )
}
