import React from "react";
import { ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps): React.JSX.Element => {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 6; // Show up to 6 page numbers before ellipsis
    
    if (totalPages <= maxVisible + 1) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 3) {
        // Show first few pages
        for (let i = 2; i <= maxVisible; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show last few pages
        pages.push("ellipsis");
        for (let i = totalPages - (maxVisible - 1); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages around current
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-[50px]">
      {pageNumbers.map((page, index) => {
        if (page === "ellipsis") {
          return (
            <span key={`ellipsis-${index}`} className="text-black text-[14px] px-2">
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => {
              onPageChange(pageNum);
            }}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              font-sansation text-[14px] transition-all
              ${
                isActive
                  ? "bg-[#ab0007] text-white"
                  : "bg-[#f3f3f3] text-black hover:bg-[#e0e0e0]"
              }
            `}
            aria-label={`Go to page ${pageNum}`}
            aria-current={isActive ? "page" : undefined}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        className={`
          w-8 h-8 rounded-full flex items-center justify-center
          border-2 border-[#ab0007] bg-white
          transition-all
          ${
            currentPage >= totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#ab0007] cursor-pointer"
          }
        `}
        aria-label="Next page"
      >
        <ChevronRight 
          className={`w-4 h-4 transition-colors ${
            currentPage >= totalPages 
              ? "text-[#ab0007] opacity-50" 
              : "text-[#ab0007]"
          }`} 
        />
      </button>
    </div>
  );
};

