import React from "react";
import type { ViewProductDto } from "../../types/ProductDTO";
import { ProductCard } from "../ProductCard";
import { DECOR_TOP_PRODUCT_CARD } from "../../constants/imageAssets";

interface GundamKingdomCardsSectionProps {
  products?: ViewProductDto[];
  isLoading?: boolean;
}

export const GundamKingdomCardsSection = ({ 
  products = [], 
  isLoading = false 
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

  const displayProducts = products.slice(0, 3);
  
  // All cards at SAME vertical position, evenly spaced horizontally
  const cardPositions = [
    { top: "0px", left: "0px" },       // Left card
    { top: "0px", left: "247px" },     // Middle card - same top!
    { top: "0px", left: "494px" }      // Right card - same top!
  ];

  return (
    <section className="absolute top-[1280px] left-[134px] w-[950px] h-[350px]">
      {displayProducts.map((product, index) => (
        <article 
          key={product.productId}
          className="absolute w-[203px] h-[309px]"
          style={{ 
            top: cardPositions[index]?.top, 
            left: cardPositions[index]?.left 
          }}
        >
          {/* Decorative element */}
          <img
            className="absolute top-0 left-[23px] w-[157px] h-[53px] aspect-[2.95] object-cover z-10"
            alt="Decorative element"
            src={DECOR_TOP_PRODUCT_CARD}
          />
          
          {/* Product Card */}
          <ProductCard  
            product={product}
            className="absolute"
            style={{ top: "24px", left: "0" }}
            discount={30}
          />
        </article>
      ))}
    </section>
  );
};

