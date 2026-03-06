import React, { useEffect, useMemo } from "react";
import type { ViewProductDto } from "../../types/ProductDTO";
import { ProductCard } from "../ProductCard";
import { DECOR_LANTERNS_ENVELOPES } from "../../constants/imageAssets";

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
  if (isLoading) {
    return (
      <section className="absolute top-[1280px] left-[134px] w-[950px] h-[350px] flex items-center justify-center">
        <p className="[font-family:'Tilt_Warp-Regular',Helvetica] text-white text-lg">Đang tải...</p>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="absolute top-[1280px] left-[134px] w-[950px] h-[350px] flex items-center justify-center">
        <p className="[font-family:'Tilt_Warp-Regular',Helvetica] text-white text-lg">Không có sản phẩm Gundam</p>
      </section>
    );
  }

  const pageSize = 4;
  const pageCount = Math.max(1, Math.min(maxPages, Math.ceil(products.length / pageSize)));
  const safePage = Math.max(0, Math.min(page, pageCount - 1));
  const displayProducts = useMemo(
    () => products.slice(0, pageCount * pageSize),
    [products, pageCount]
  );

  useEffect(() => {
    if (safePage !== page) onPageChange?.(safePage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safePage]);

  const pages = useMemo(() => {
    const result: ViewProductDto[][] = [];
    for (let i = 0; i < pageCount; i++) {
      result.push(displayProducts.slice(i * pageSize, i * pageSize + pageSize));
    }
    return result;
  }, [displayProducts, pageCount]);

  return (
    <section className="absolute top-[1280px] left-[111px] w-[991px] h-[350px] overflow-hidden">
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${safePage * 100}%)` }}
      >
        {pages.map((pageProducts, pageIndex) => (
          <div key={`gundam-page-${pageIndex}`} className="w-full shrink-0 h-full flex items-center justify-center">
            <div className="flex gap-x-[34px]">
              {pageProducts.map((product) => (
                <article key={product.productId} className="relative w-[203px] h-[309px] shrink-0">
                  <img
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[157px] h-[53px] object-contain z-10 pointer-events-none"
                    alt="Trang trí lì xì"
                    src={DECOR_LANTERNS_ENVELOPES}
                  />

                  <ProductCard
                    product={product}
                    className="absolute"
                    style={{ top: "24px", left: "0" }}
                  />
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

