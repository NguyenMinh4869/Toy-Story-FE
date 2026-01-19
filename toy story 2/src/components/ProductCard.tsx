import React from "react";
import { Link } from "react-router-dom";
import type { ViewProductDto } from "../types/ProductDTO";
import { formatPrice } from "../utils/formatPrice";
import { PRODUCT_IMAGE_87, PRODUCT_IMAGE_107, DECOR_LINE_15 } from "../constants/imageAssets";

interface ProductCardProps {
  product: ViewProductDto;
  className?: string;
  style?: React.CSSProperties;
  // Optional customization
  backgroundImage?: string;
  decorativeLine?: string;
  discount?: number; // Discount percentage (0-100)
}

export const ProductCard = ({ 
  product, 
  className = "",
  style,
  backgroundImage = PRODUCT_IMAGE_87,
  decorativeLine = DECOR_LINE_15,
  discount = 0
}: ProductCardProps): React.JSX.Element => {
  const productPrice = product.price ?? 0;
  const productName = product.name ?? 'Unnamed Product';
  const productImage = product.imageUrl ?? PRODUCT_IMAGE_87;
  
  const hasDiscount = discount > 0;
  // Calculate original price: if current price is discounted, original = current / (1 - discount/100)
  const originalPrice = hasDiscount ? productPrice / (1 - discount / 100) : productPrice;

  return (
    <article 
      className={`relative w-[203px] h-[285px] ${className}`}
      style={style}
    >
      {/* Decorative background frame */}
      <div className="absolute top-0 left-0 w-[203px] h-[285px] rounded-[17px]">
        <img
          className="w-full h-full object-cover rounded-[17px]"
          alt="Product card background"
          src={backgroundImage}
        />
        <div className="absolute top-0 left-0 w-full h-full rounded-[17px] border border-solid border-[#d08856] pointer-events-none" />
      </div>
      
      {/* White card content */}
      <div className="absolute top-9 left-[15px] w-[170px] h-[237px] bg-white rounded-[17px] overflow-hidden">
        {/* Product Image */}
        <img
          className="absolute top-[17px] left-[22px] w-[115px] h-[115px] aspect-[1] object-cover"
          alt={productName}
          src={productImage}
        />
        
        {/* Add to Cart Button */}
        <Link
          to={`/product/${product.productId}`}
          className="absolute top-[209px] left-[22px] w-[79px] h-[15px] flex bg-[#c40029] rounded-md overflow-hidden hover:bg-[#a00022] transition-colors"
          aria-label="Thêm vào giỏ hàng"
        >
          <span className="mt-[3px] w-[62px] h-[9px] ml-[7px] [font-family:'Tilt_Warp-Regular',Helvetica] font-normal text-white text-[7px] tracking-[0] leading-[normal]">
            Thêm vào giỏ hàng
          </span>
        </Link>
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-[7px] left-[118px] w-[39px] h-[13px] flex bg-[#c40029] rounded-md overflow-hidden">
            <span className="mt-0.5 w-[25px] h-2.5 ml-[7px] [font-family:'Archivo_Black-Regular',Helvetica] text-white text-[9px] whitespace-nowrap font-normal tracking-[0] leading-[normal]">
              -{discount}%
            </span>
          </div>
        )}
        
        {/* Wishlist Button */}
        <button 
          className="absolute top-[207px] left-[122px] w-5 h-5 cursor-pointer border-0 bg-transparent p-0"
          aria-label="Thêm vào yêu thích"
        >
          <img
            className="w-full h-full object-cover"
            alt=""
            src={PRODUCT_IMAGE_107}
          />
        </button>
        
        {/* Divider Line */}
        <img
          className="absolute top-48 left-[100px] w-[60px] h-px object-cover"
          alt=""
          src={decorativeLine}
        />
      </div>
      
      {/* Product Name */}
      <p className="absolute top-[173px] left-[27px] w-[158px] [font-family:'Tilt_Warp-Regular',Helvetica] font-normal text-black text-[11px] tracking-[0] leading-[normal] line-clamp-2">
        {productName}
      </p>
      
      {/* Sale Price */}
      <div className="absolute top-[221px] left-8 w-[60px] [font-family:'Tilt_Warp-Regular',Helvetica] text-[#ff0000] text-[11px] font-normal tracking-[0] leading-[normal]">
        {formatPrice(productPrice)}
      </div>
      
      {/* Original Price (if discounted) */}
      {hasDiscount && (
        <div className="absolute top-[221px] left-[116px] w-[59px] [font-family:'Tilt_Warp-Regular',Helvetica] text-black text-[11px] font-normal tracking-[0] leading-[normal] line-through">
          {formatPrice(originalPrice)}
        </div>
      )}
    </article>
  );
};

