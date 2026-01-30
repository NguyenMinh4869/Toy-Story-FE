import React, { useEffect, useMemo } from "react";
import type { ViewProductDto } from "../../types/ProductDTO";
import { ProductCard } from "../ProductCard";
import { PRODUCT_IMAGE_87, DECOR_TOP_PRODUCT_CARD } from "../../constants/imageAssets";

// Figma MCP Asset URL for decorative line
const decorativeLine = "https://www.figma.com/api/mcp/asset/d3ec4de9-3478-4971-9327-7ad41ea78b50";

interface PromotionalOffersSectionProps {
  products?: ViewProductDto[];
  isLoading?: boolean;
  page?: number;
  onPageChange?: (nextPage: number) => void;
  maxPages?: number;
}

export const PromotionalOffersSection = ({
  products = [],
  isLoading = false,
  page = 0,
  onPageChange,
  maxPages = 3,
}: PromotionalOffersSectionProps): React.JSX.Element => {
  if (isLoading) {
    return (
      <section className="absolute top-[669px] left-[111px] w-[991px] h-[465px] flex rounded-[45px] overflow-hidden bg-[linear-gradient(180deg,rgba(248,227,184,1)_0%,rgba(226,182,99,1)_100%)] items-center justify-center">
        <p className="[font-family:'Tilt_Warp-Regular',Helvetica] text-white text-lg">Đang tải...</p>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="absolute top-[669px] left-[111px] w-[991px] h-[465px] flex rounded-[45px] overflow-hidden bg-[linear-gradient(180deg,rgba(248,227,184,1)_0%,rgba(226,182,99,1)_100%)] items-center justify-center">
        <p className="[font-family:'Tilt_Warp-Regular',Helvetica] text-white text-lg">Không có sản phẩm khuyến mãi</p>
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
    <section className="absolute top-[669px] left-[111px] w-[991px] h-[465px] rounded-[45px] overflow-hidden bg-[linear-gradient(180deg,rgba(248,227,184,1)_0%,rgba(226,182,99,1)_100%)]">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${safePage * 100}%)` }}
        >
          {pages.map((pageProducts, pageIndex) => (
            <div key={`promo-page-${pageIndex}`} className="w-full shrink-0 h-full">
              <div className="pt-[100px] px-[21px] flex gap-x-[34px]">
                {pageProducts.map((product) => (
                  <article key={product.productId} className="relative w-[203px] h-[309px]">
                    <img
                      className="absolute top-0 left-[23px] w-[157px] h-[53px] aspect-[2.95] object-cover z-10"
                      alt="Decorative element"
                      src={DECOR_TOP_PRODUCT_CARD}
                    />
                    <ProductCard
                      product={product}
                      className="absolute"
                      style={{ top: "24px", left: "0" }}
                      backgroundImage={PRODUCT_IMAGE_87}
                      decorativeLine={decorativeLine}
                    />
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
