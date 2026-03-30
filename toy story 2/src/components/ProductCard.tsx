import React from "react";
import { Link, useNavigate } from "react-router-dom";
import type { ViewProductDto } from "../types/ProductDTO";
import { formatPrice } from "../utils/formatPrice";
import { PRODUCT_IMAGE_87 } from "../constants/imageAssets";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface ProductCardProps {
  product: ViewProductDto;
  className?: string;
  style?: React.CSSProperties;
  discount?: number;
}

export const ProductCard = ({
  product,
  className = "",
  style,
  discount = 0,
}: ProductCardProps): React.JSX.Element => {
  const navigate = useNavigate();
  const productPrice = product.price ?? 0;
  const productName = product.name ?? "Unnamed Product";
  const productImage = product.imageUrl ?? PRODUCT_IMAGE_87;

  const hasDiscount = typeof discount === "number" && discount > 0;
  const originalPrice = hasDiscount
    ? productPrice / (1 - (discount ?? 0) / 100)
    : productPrice;

  const handleCardClick = () => {
    navigate(`/product/${product.productId}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={handleCardClick}
      className={cn(
        "group relative bg-white rounded-[2.5rem] p-6 flex flex-col items-center select-none cursor-pointer",
        "w-[250px] h-[380px] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.3)] transition-shadow duration-300",
        className
      )}
      style={style}
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-6 right-6 z-20 overflow-hidden rounded-xl">
           <div className="bg-red-600 text-white px-3 py-1.5 text-[11px] font-bold font-archivo tracking-tight shadow-md">
            -{discount}%
          </div>
        </div>
      )}

      {/* Image Container with Hover Effect */}
      <div className="relative aspect-square mb-4 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 group-hover:border-red-100 transition-colors">
        <motion.img
          whileHover={{ scale: 1.15, rotate: 2 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="w-full h-full object-contain drop-shadow-xl"
          alt={productName}
          src={productImage}
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
      </div>

      {/* Product Info */}
      <div className="w-full flex flex-col flex-1 px-1">
        <h3 className="text-[15px] leading-[1.4] text-gray-800 font-medium line-clamp-2 min-h-[42px] mb-3 group-hover:text-red-600 transition-colors">
          {productName}
        </h3>

        <div className="mt-auto">
          {/* Pricing */}
          <div className="flex flex-col mb-3">
            <span className="text-red-600 font-tilt-warp text-2xl leading-none tracking-tight">
              {formatPrice(productPrice)}
            </span>
            {hasDiscount && (
              <span className="text-gray-400 text-[13px] line-through mt-1">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <Link
              to={`/product/${product.productId}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-red-600 text-white py-3 rounded-[1rem] text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-black transition-colors duration-300 shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Thêm</span>
            </Link>
            
            <button 
              className="p-3 rounded-[1rem] border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
              aria-label="Wishlist"
              onClick={(e) => {
                e.stopPropagation();
                // Add to wishlist logic here
              }}
            >
              <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Subtle bottom accent line appearing on hover */}
      <motion.div 
        initial={{ width: 0 }}
        whileHover={{ width: "80%" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 h-[2px] bg-red-600/30 rounded-full"
      />
    </motion.article>
  );
};
