import React from "react";
import type { ViewProductDto } from "../../types/ProductDTO";
import { ProductCard } from "../ProductCard";
import { PRODUCT_IMAGE_87 } from "../../constants/imageAssets";

// Figma MCP Asset URL for decorative line
const decorativeLine = "https://www.figma.com/api/mcp/asset/d3ec4de9-3478-4971-9327-7ad41ea78b50";

interface PromotionalOffersSectionProps {
  products?: ViewProductDto[];
  isLoading?: boolean;
}

export const PromotionalOffersSection = ({ products = [], isLoading = false }: PromotionalOffersSectionProps): React.JSX.Element => {
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

  const displayProducts = products.slice(0, 4);
  const marginLeftValues = ["ml-[21px]", "ml-[42px]", "ml-[38px]", "ml-[30px]"];

  return (
    <section className="absolute top-[669px] left-[111px] w-[991px] h-[465px] flex rounded-[45px] overflow-hidden bg-[linear-gradient(180deg,rgba(248,227,184,1)_0%,rgba(226,182,99,1)_100%)]">
      {displayProducts.map((product, index) => (
        <ProductCard
          key={product.productId}
          product={product}
          className={`mt-[100px] ${marginLeftValues[index] || ""}`}
          backgroundImage={PRODUCT_IMAGE_87}
          decorativeLine={decorativeLine}
          discount={30}
        />
      ))}
    </section>
  );
};
