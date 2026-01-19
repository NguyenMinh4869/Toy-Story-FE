import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate page numbers to display
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = []
    const maxVisible = 5 // Maximum number of page buttons to show

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-[32px] h-[32px] flex items-center justify-center rounded-full border transition-colors cursor-pointer ${
          currentPage === 1
            ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-white'
            : 'border-[#ab0007] text-[#ab0007] hover:bg-[#ab0007] hover:text-white bg-white'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="w-[32px] h-[32px] flex items-center justify-center text-gray-400 font-sansation text-[14px]">
              ...
            </span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`w-[32px] h-[32px] flex items-center justify-center rounded-full font-sansation text-[14px] transition-colors cursor-pointer border ${
                currentPage === page
                  ? 'bg-[#ab0007] text-white border-[#ab0007]'
                  : 'bg-white text-black border-gray-200 hover:border-[#ab0007] hover:text-[#ab0007]'
              }`}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-[32px] h-[32px] flex items-center justify-center rounded-full border transition-colors cursor-pointer ${
          currentPage === totalPages
            ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-white'
            : 'border-[#ab0007] text-[#ab0007] hover:bg-[#ab0007] hover:text-white bg-white'
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  )
}

export default Pagination
