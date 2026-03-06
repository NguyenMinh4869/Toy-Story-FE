import React, { useEffect, useMemo } from "react";
import type { ViewProductDto } from "../../types/ProductDTO";
import { SectionHeader } from "./SectionHeader";

import { DECOR_DYNAMIC_BRAND, FAV_TOY_DECOR } from "../../constants/imageAssets";

// Figma MCP Asset URLs
const image20 = "https://www.figma.com/api/mcp/asset/f8d42236-59cd-4852-bcb7-126b11fed0d1";

interface FavoriteProductsSectionProps {
  products: ViewProductDto[];
  isLoading: boolean;
  page?: number;
  onPageChange?: (nextPage: number) => void;
  maxPages?: number;
}

export const FavoriteProductsSection = ({
  products,
  isLoading,
  page = 0,
  onPageChange,
  maxPages = 3,
}: FavoriteProductsSectionProps): React.JSX.Element => {
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
    <section aria-label="Đồ chơi yêu thích">
      <SectionHeader 
        title="Đồ chơi yêu thích"
        top="1700px"
      />

      {products.length > 0 ? (
        <div className="absolute top-[1842px] left-[126px] w-[940px] h-[260px] overflow-hidden">
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${safePage * 100}%)` }}
          >
            {pages.map((pageProducts, pageIndex) => (
              <div
                key={`fav-page-${pageIndex}`}
                className="w-full shrink-0 h-full flex justify-between items-start gap-[24px] px-2"
              >
                {pageProducts.map((product) => (
                  <div key={product.productId} className="relative w-[220px] h-[240px]">
                    {/* Trang trí thẻ (decor dynamic brand) */}
                    <img
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-auto aspect-[6] object-contain z-20"
                      alt="Trang trí brand"
                      src={DECOR_DYNAMIC_BRAND}
                    />
                    {/* Product image (underlay) */}
                    <img
                      className="absolute top-[22px] left-1/2 -translate-x-1/2 w-[199px] h-[199px] object-cover z-0"
                      alt={product.name ?? "Product"}
                      src={product.imageUrl ?? image20}
                    />
                    {/* Frame overlay (overlap layer) */}
                    <img
                      className="absolute top-[22px] left-1/2 -translate-x-1/2 w-[202px] h-[208px] object-cover z-10 pointer-events-none"
                      alt=""
                      src={FAV_TOY_DECOR}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : !isLoading && (
        <div className="absolute top-[1869px] left-[132px] w-[800px] text-center">
          <p className="[font-family:'Tilt_Warp-Regular',Helvetica] text-white text-lg">Không có sản phẩm yêu thích</p>
        </div>
      )}
    </section>
  );
};

