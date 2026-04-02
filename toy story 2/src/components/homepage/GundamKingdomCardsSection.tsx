import React, { useEffect, useMemo } from "react";
import type { ViewProductDto } from "../../types/ProductDTO";
import { ProductCard } from "../ProductCard";
import { NavigationButton } from "./NavigationButton";
import { motion } from "framer-motion";

interface GundamKingdomCardsSectionProps {
  products?: ViewProductDto[];
  isLoading?: boolean;
  page?: number;
  onPageChange?: (nextPage: number) => void;
  maxPages?: number;
}

export const GundamKingdomCardsSection = ({ 
  products = [], 
  isLoading = false,
  page = 0,
  onPageChange,
  maxPages = 3,
}: GundamKingdomCardsSectionProps): React.JSX.Element => {
  const pageSize = 4;
  const pageCount = Math.max(1, Math.min(maxPages, Math.ceil(products.length / pageSize)));
  const safePage = Math.max(0, Math.min(page, pageCount - 1));

  const goNext = () => onPageChange?.((safePage + 1) % pageCount);
  const goPrev = () => onPageChange?.((safePage - 1 + pageCount) % pageCount);

  useEffect(() => {
    if (safePage !== page) onPageChange?.(safePage);
  }, [safePage, page, onPageChange]);

  const displayProducts = useMemo(
    () => products.slice(0, pageCount * pageSize),
    [products, pageCount]
  );

  const pages = useMemo(() => {
    const result: ViewProductDto[][] = [];
    for (let i = 0; i < pageCount; i++) {
      result.push(displayProducts.slice(i * pageSize, i * pageSize + pageSize));
    }
    return result;
  }, [displayProducts, pageCount]);

  if (isLoading) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full px-12">
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `-${safePage * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {pages.map((pageProducts, pageIndex) => (
            <div key={`gundam-page-${pageIndex}`} className="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center items-stretch py-4">
              {pageProducts.map((product) => (
                <div 
                  key={product.productId} 
                  className="relative h-full w-full"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {pageCount > 1 && (
        <>
          <NavigationButton 
            config={{ 
              direction: "left", 
              onClick: goPrev, 
              variant: "white",
              className: "absolute left-0 top-1/2 -translate-y-1/2 z-20 shadow-xl"
            }} 
          />
          <NavigationButton 
            config={{ 
              direction: "right", 
              onClick: goNext, 
              variant: "white",
              className: "absolute right-0 top-1/2 -translate-y-1/2 z-20 shadow-xl"
            }} 
          />
        </>
      )}
    </div>
  );
};

