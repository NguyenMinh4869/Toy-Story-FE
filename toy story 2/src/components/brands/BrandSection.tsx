/**
 * BrandSection Component
 * Renders a section for each letter group with its brands
 */

import React from 'react'
import { BrandCard } from './BrandCard'
import type { GroupedBrands } from '../../utils/brandUtils'

interface BrandSectionProps {
  group: GroupedBrands
  className?: string
}

export const BrandSection: React.FC<BrandSectionProps> = ({ group, className = '' }) => {
  const { letter, brands } = group

  return (
    <section
      id={`brand-section-${letter}`}
      className={`scroll-mt-32 ${className}`}
      aria-labelledby={`brand-heading-${letter}`}
    >
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-6">
        <h2
          id={`brand-heading-${letter}`}
          className="text-4xl font-bold text-red-600"
        >
          {letter}
        </h2>
        <div className="flex-1 h-0.5 bg-gradient-to-r from-red-600 to-transparent"></div>
        <span className="text-sm text-gray-500 font-medium">
          {brands.length} {brands.length === 1 ? 'brand' : 'brands'}
        </span>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {brands.map((brand) => (
          <BrandCard
            key={brand.brandId}
            brand={brand}
          />
        ))}
      </div>
    </section>
  )
}
