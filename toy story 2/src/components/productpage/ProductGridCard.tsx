import React from "react";
import { Link } from "react-router-dom";
import type { ViewProductDto } from "../../types/ProductDTO";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "@/context/CartContext";

interface ProductGridCardProps {
  product: ViewProductDto;
  className?: string;
}

const PRODUCT_PLACEHOLDER =
  "https://www.figma.com/api/mcp/asset/298b739b-7401-4df7-acd0-41acee837979";

export const ProductGridCard: React.FC<ProductGridCardProps> = ({
  product,
  className = "",
}) => {
  const productPrice = product.price ?? 0;
  const productName = product.name ?? "Unnamed Product";
  const productImage = product.imageUrl ?? PRODUCT_PLACEHOLDER;
  const { addToCart } = useCart();

  const discount = 30;
  const originalPrice = productPrice / (1 - discount / 100);

  const handleAddToCart = (e: React.MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product.productId!, undefined, 1)
  }

  return (
    <Link
      to={`/product/${product.productId}`}
      className={`block bg-white border border-[#5a5050]/20 rounded-[17px] overflow-hidden hover:shadow-lg transition-shadow no-underline ${className}`}
    >
      <div className="relative flex justify-center items-center pt-5 pb-4">
        <img
          src={productImage}
          alt={productName}
          className="w-[200px] h-[200px] object-cover rounded-[12px]"
          onError={(e) => {
            e.currentTarget.src = PRODUCT_PLACEHOLDER;
          }}
        />
      </div>

      <div className="px-[18px] pb-5">
        <h3 className="font-tilt-warp text-[14px] text-black leading-[1.4] line-clamp-3">
          {productName}
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <span className="font-tilt-warp text-[20px] text-[#ff0000]">
            {formatPrice(productPrice)}
          </span>
          <span className="font-tilt-warp text-[20px] text-[#574848] line-through">
            {formatPrice(originalPrice)}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#c40029] hover:bg-[#a00022] text-white font-tilt-warp text-[16px] py-[10px] px-6 rounded-[6px] transition-colors cursor-pointer border-none"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductGridCard;
