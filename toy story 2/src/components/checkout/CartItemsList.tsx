// components/checkout/CartItemsList.tsx
import React from "react";
import { useCart, type CartItem } from "@/context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemsListProps {
  items: CartItem[];
}

const CartItemsList: React.FC<CartItemsListProps> = ({ items }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Sản phẩm ({items.length})
      </h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={"productId" in item.product ? item.product.productId : item.product.setId}
            className="flex gap-4 py-4 border-b border-gray-100 last:border-0"
          >
            {/* Product Image */}
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {item.product.imageUrl ? (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
              
              <div className="flex justify-between items-start mt-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8 bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item, item.quantity - 1)}
                        className="w-8 h-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 h-full flex items-center justify-center font-bold text-gray-900 text-sm border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                        className="w-8 h-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      title="Xóa khỏi giỏ hàng"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex flex-col mt-1">
                    <span className="text-red-600 font-semibold">
                      {formatPrice(item.product.price)}
                    </span>
                    {item.originalUnitPrice && item.originalUnitPrice > item.product.price ? (
                      <span className="text-gray-400 text-xs line-through mt-0.5">
                        {formatPrice(item.originalUnitPrice)}
                      </span>
                    ) : null}
                  </div>
                </div>
                
                <div className="flex flex-col text-right h-full justify-between">
                  <span className="text-gray-500 text-sm">
                    Thành tiền: <span className="text-gray-900 font-medium">{formatPrice(item.serverTotalPrice ?? (item.product.price * item.quantity))}</span>
                  </span>
                  {item.originalTotalPrice && item.originalTotalPrice > (item.serverTotalPrice ?? 0) ? (
                    <span className="text-gray-400 text-xs line-through mt-0.5">
                      {formatPrice(item.originalTotalPrice)}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>      
    </div>
  );
};

export default CartItemsList;