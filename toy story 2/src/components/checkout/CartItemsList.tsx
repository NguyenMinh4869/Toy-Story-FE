// components/checkout/CartItemsList.tsx
import React from "react";
import type { CartItem } from "@/context/CartContext";

interface CartItemsListProps {
  items: CartItem[];
}

const CartItemsList: React.FC<CartItemsListProps> = ({ items }) => {
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
        {items.map((item, index) => (
          <div
            key={index}
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
              <p className="text-sm text-gray-500 mt-1">
                Số lượng: {item.quantity}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-red-600 font-semibold">
                  {formatPrice(item.product.price)}
                </span>
                <span className="text-gray-500 text-sm">
                  Thành tiền: {formatPrice(item.serverTotalPrice ?? (item.product.price * item.quantity))}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>      
    </div>
  );
};

export default CartItemsList;