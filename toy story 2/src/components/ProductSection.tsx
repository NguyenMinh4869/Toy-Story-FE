import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard"; // Import the component
import { ViewProductDto } from "../types/ProductDTO";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: ViewProductDto[];
  hasGradient?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  products,
  hasGradient = false,
}) => {
  return (
    <section
      className={`py-20 px-[111px] mb-20 relative max-xl:px-5 max-xl:py-10 ${hasGradient ? "bg-gradient-to-b from-[#f8e3b8] via-[#f8e3b8] to-[#e2b663] rounded-[45px] py-[100px] px-[21px] pb-20 mx-[111px] mb-20 max-xl:mx-5" : ""}`}
    >
      {/* Header section - keep this */}
      <div className="text-center mb-10">
        {subtitle && (
          <div className="mb-5 h-[53px] flex items-center justify-center">
            <div className="w-[157px] h-[53px] bg-white/20 rounded-lg"></div>
          </div>
        )}
        <h2
          className={`font-tilt-warp text-5xl bg-gradient-to-b from-white via-white to-[#ffd900] bg-clip-text text-transparent m-0 leading-[1.2] text-center ${!hasGradient ? "mb-[27px]" : ""}`}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="font-tilt-warp text-sm text-white m-2.5">{subtitle}</p>
        )}
        <div className="flex items-center justify-center gap-[17px] mt-[27px]">
          <div className="w-[405px] h-1 bg-[#d8c59e] border border-black/16 max-xl:w-[200px]"></div>
          <div className="w-[53.707px] h-[53.707px] rotate-[13deg]">
            <div className="w-full h-full bg-[#d8c59e] rounded-sm border border-black/16"></div>
          </div>
          <div className="w-[405px] h-1 bg-[#d8c59e] border border-black/16 max-xl:w-[200px]"></div>
        </div>
      </div>

      {/* Products carousel - simplified! */}
      <div className="relative flex items-center gap-5">
        <button
          className="bg-transparent border-none cursor-pointer w-[33px] h-[31px] flex-shrink-0 z-[2]"
          aria-label="Previous"
        >
          <ChevronLeft size={33} stroke="white" strokeWidth={3} />
        </button>

        <div className="flex gap-[50px] overflow-x-auto scroll-smooth flex-1 py-5 [&::-webkit-scrollbar]:hidden">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>

        <button
          className="bg-transparent border-none cursor-pointer w-[33px] h-[31px] flex-shrink-0 z-[2]"
          aria-label="Next"
        >
          <ChevronRight size={33} stroke="white" strokeWidth={3} />
        </button>
      </div>
    </section>
  );
};

export default ProductSection;
