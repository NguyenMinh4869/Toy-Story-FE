import React from 'react'
import { Link } from 'react-router-dom'
import type { ViewProductDto } from '../../types/ProductDTO'
import { formatPrice } from '../../utils/formatPrice'
import { Heart } from 'lucide-react'

interface ProductGridCardProps {
  product: ViewProductDto
  className?: string
}

// Product image placeholder
const PRODUCT_PLACEHOLDER = "https://www.figma.com/api/mcp/asset/298b739b-7401-4df7-acd0-41acee837979"
// Wishlist icon 
const WISHLIST_ICON = "https://www.figma.com/api/mcp/asset/8e8b001d-481c-4b48-b32b-55408d2ebd98"

export const ProductGridCard: React.FC<ProductGridCardProps> = ({ 
  product,
  className = ''
}) => {
  const productPrice = product.price ?? 0
  const productName = product.name ?? 'Unnamed Product'
  const productImage = product.imageUrl ?? PRODUCT_PLACEHOLDER
  
  // Calculate discount (30% for demo)
  const discount = 30
  const originalPrice = productPrice / (1 - discount / 100)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product.productId)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement wishlist functionality
    console.log('Add to wishlist:', product.productId)
  }

  return (
    <Link
      to={`/product/${product.productId}`}
      className={`block bg-white border border-[#5a5050]/20 rounded-[17px] overflow-hidden hover:shadow-lg transition-shadow no-underline ${className}`}
    >
      {/* Product Image Container */}
      <div className="relative flex justify-center items-center pt-5 pb-4">
        <img
          src={productImage}
          alt={productName}
          className="w-[200px] h-[200px] object-cover rounded-[12px]"
          onError={(e) => {
            e.currentTarget.src = PRODUCT_PLACEHOLDER
          }}
        />
      </div>

      {/* Product Info */}
      <div className="px-[18px] pb-5">
        {/* Product Name */}
        <h3 className="font-tilt-warp text-[14px] text-black leading-[1.4] mb-3 min-h-[58px] line-clamp-3">
          {productName}
        </h3>

        {/* Prices */}
        <div className="flex items-center gap-4 mb-4">
          <span className="font-tilt-warp text-[20px] text-[#ff0000]">
            {formatPrice(productPrice)}
          </span>
          <span className="font-tilt-warp text-[20px] text-[#574848] line-through">
            {formatPrice(originalPrice)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#c40029] hover:bg-[#a00022] text-white font-tilt-warp text-[16px] py-[10px] px-6 rounded-[6px] transition-colors cursor-pointer border-none"
          >
            Thêm vào giỏ hàng
          </button>
          <button
            onClick={handleWishlist}
            className="w-[40px] h-[40px] flex items-center justify-center border border-gray-200 rounded-full hover:border-[#c40029] hover:text-[#c40029] transition-colors cursor-pointer bg-white"
            aria-label="Add to wishlist"
          >
            <Heart size={20} className="text-gray-400" />
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductGridCard
