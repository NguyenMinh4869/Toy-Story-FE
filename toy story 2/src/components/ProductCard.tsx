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
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const productPrice = product.price ?? 0;
  const productFinalPrice = product.finalPrice ?? productPrice;
  const hasPromotion = product.hasPromotion && productPrice > productFinalPrice;
  const promoInfo = (product as any).promoInfo as any;
  const discountPercent = hasPromotion
    ? Math.round(((productPrice - productFinalPrice) / productPrice) * 100)
    : 0;
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
      whileHover={{ y: -5 }}
      onClick={handleCardClick}
      className="group relative bg-white rounded-[2rem] p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100/50 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {/* Discount Badge */}
      {hasPromotion && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-red-600 text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-red-200"
          >
            {discountLabel}
          </motion.div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-square mb-6 rounded-[1.5rem] overflow-hidden bg-gray-50 group-hover:bg-white transition-colors duration-500">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          src={product.imageUrl || PRODUCT_IMAGE_87}
          alt={product.name ?? ""}
          className="w-full h-full object-contain p-4"
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow space-y-3">
        {/* Category/Brand */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            {product.brandName || "Toy Story"}
          </span>
          <div className="h-1 w-1 rounded-full bg-gray-300" />
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500">
            {product.categoryName || "Hot Deal"}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-black text-gray-800 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Pricing & Actions */}
        <div className="pt-2 mt-auto space-y-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-[18px] font-black text-red-600">
                {formatPrice(productFinalPrice)}
              </span>
              {hasPromotion && (
                <span className="text-[12px] text-gray-400 line-through font-bold">
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
                className="flex-1 bg-red-600 text-white py-3 rounded-[1rem] text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-black transition-colors duration-300 shadow-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Thêm</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Subtle bottom accent line appearing on hover */}
      <motion.div 
        initial={{ width: 0 }}
        whileHover={{ width: "80%" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 h-[2px] bg-red-600/30 rounded-full"
      />
    </motion.div>
  );
};

export default ProductCard;
