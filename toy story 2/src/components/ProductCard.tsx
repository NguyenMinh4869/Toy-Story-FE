import React from "react";
import { Link, useNavigate } from "react-router-dom";
import type { ProductDTO } from "../types/ProductDTO";
import { formatPrice } from "../utils/formatPrice";
import { PRODUCT_IMAGE_87 } from "../constants/imageAssets";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

interface ProductCardProps {
  product: ProductDTO;
  /** Tighter layout for carousels / promo detail */
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const productPrice = product.price ?? 0;
  const productFinalPrice = product.finalPrice ?? productPrice;
  const hasPromotion = product.hasPromotion && productPrice > productFinalPrice;
  const promoInfo = (product as any).promoInfo as any;
  const rawPercent = hasPromotion && productPrice > 0
    ? Math.round(((productPrice - productFinalPrice) / productPrice) * 100)
    : 0;
  const discountPercent = Math.min(100, Math.max(0, rawPercent));
  const discountLabel = hasPromotion
    ? (promoInfo && promoInfo.discountType === 1
        ? `-${(promoInfo.discountValue / 1000).toFixed(0)}K`
        : `-${discountPercent}%`)
    : "";

  const handleCardClick = () => {
    navigate(`/product/${product.productId}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: compact ? -2 : -5 }}
      onClick={handleCardClick}
      className={
        compact
          ? "group relative bg-white rounded-xl p-2 sm:p-2.5 transition-all duration-300 hover:shadow-lg border border-gray-100/50 cursor-pointer overflow-hidden flex flex-col h-full w-[148px] sm:w-[164px]"
          : "group relative bg-white rounded-[2rem] p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100/50 cursor-pointer overflow-hidden flex flex-col h-full"
      }
    >
      {/* Discount Badge */}
      {hasPromotion && (
        <div className={compact ? "absolute top-2 right-2 z-10" : "absolute top-4 right-4 z-10"}>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={
              compact
                ? "bg-red-600 text-white text-[9px] font-black min-h-[1.5rem] min-w-[2.75rem] px-2 py-0.5 rounded-full shadow-md shadow-red-200 inline-flex items-center justify-center whitespace-nowrap max-w-[5rem] truncate"
                : "bg-red-600 text-white text-[11px] font-black min-h-[1.75rem] min-w-[3rem] px-3 py-1.5 rounded-full shadow-lg shadow-red-200 inline-flex items-center justify-center whitespace-nowrap"
            }
          >
            {discountLabel}
          </motion.div>
        </div>
      )}

      {/* Image Container */}
      <div
        className={
          compact
            ? "relative aspect-square mb-2 rounded-lg overflow-hidden bg-gray-50 group-hover:bg-white transition-colors duration-300"
            : "relative aspect-square mb-6 rounded-[1.5rem] overflow-hidden bg-gray-50 group-hover:bg-white transition-colors duration-500"
        }
      >
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          src={product.imageUrl || PRODUCT_IMAGE_87}
          alt={product.name ?? ""}
          className={compact ? "w-full h-full object-contain p-1.5" : "w-full h-full object-contain p-4"}
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className={compact ? "flex flex-col flex-grow space-y-1.5" : "flex flex-col flex-grow space-y-3"}>
        {/* Category/Brand */}
        <div className={`flex items-center gap-1 ${compact ? "flex-wrap" : "gap-2"}`}>
          <span
            className={
              compact
                ? "text-[8px] font-black uppercase tracking-wide text-gray-400 truncate max-w-[45%]"
                : "text-[10px] font-black uppercase tracking-widest text-gray-400"
            }
          >
            {product.brandName || "Toy Story"}
          </span>
          {!compact && <div className="h-1 w-1 rounded-full bg-gray-300" />}
          <span
            className={
              compact
                ? "text-[8px] font-black uppercase tracking-wide text-red-500 truncate max-w-[45%]"
                : "text-[10px] font-black uppercase tracking-widest text-red-500"
            }
          >
            {product.categoryName || "Hot Deal"}
          </span>
        </div>

        {/* Title */}
        <h3
          className={
            compact
              ? "text-[11px] font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors min-h-[2.25rem]"
              : "text-[15px] font-black text-gray-800 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors duration-300"
          }
        >
          {product.name}
        </h3>

        {/* Pricing & Actions */}
        <div className={compact ? "pt-0.5 mt-auto space-y-2" : "pt-2 mt-auto space-y-4"}>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-baseline gap-1">
              <span className={compact ? "text-sm font-black text-red-600" : "text-[18px] font-black text-red-600"}>
                {formatPrice(productFinalPrice)}
              </span>
              {hasPromotion && (
                <span className={compact ? "text-[9px] text-gray-400 line-through font-semibold" : "text-[12px] text-gray-400 line-through font-bold"}>
                  {formatPrice(productPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Action Row */}
          {user && role === "Member" && (
            <div className="flex items-center gap-2">
              <Link
                to={`/product/${product.productId}`}
                onClick={(e) => e.stopPropagation()}
                className={
                  compact
                    ? "flex-1 bg-red-600 text-white py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-1 hover:bg-black transition-colors duration-300 shadow-sm"
                    : "flex-1 bg-red-600 text-white py-3 rounded-[1rem] text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-black transition-colors duration-300 shadow-sm"
                }
              >
                <ShoppingCart className={compact ? "w-3 h-3" : "w-4 h-4"} />
                <span>Thêm</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Subtle bottom accent line appearing on hover */}
      {!compact && (
        <motion.div 
          initial={{ width: 0 }}
          whileHover={{ width: "80%" }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 h-[2px] bg-red-600/30 rounded-full"
        />
      )}
    </motion.div>
  );
};

export default ProductCard;
