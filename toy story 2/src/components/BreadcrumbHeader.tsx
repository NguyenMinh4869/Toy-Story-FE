/**
 * BreadcrumbHeader Component
 * Thin header with breadcrumb navigation, reusable across pages
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../routes/routePaths'

export interface BreadcrumbItem {
  label: string
  to?: string // If not provided, render as plain text
}

interface BreadcrumbHeaderProps {
  items: BreadcrumbItem[]
  className?: string
}

export const BreadcrumbHeader: React.FC<BreadcrumbHeaderProps> = ({ items, className = '' }) => {
  return (
    <header className={`bg-[#ededed] border-b border-red-900 py-2 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-700">
        <Link to={ROUTES.HOME} className="hover:underline text-gray-500">Trang chủ</Link>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <span className="mx-1 text-gray-400">&gt;</span>
            {item.to ? (
              <Link to={item.to} className="hover:underline text-gray-500">{item.label}</Link>
            ) : (
              <span className="font-semibold text-black">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </header>
  )
}
