// components/CartItemsList.tsx
import React from "react";
import { formatPrice } from "@/utils/formatPrice";
import { CartItem } from "@/context/CartContext";

interface CartItemsListProps {
  items: CartItem[];
}

const CartItemsList: React.FC<CartItemsListProps> = ({ items }) => {
  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-red-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
          <span className="text-red-600 font-bold">2</span>
        </div>
        <h2 className="text-xl font-tilt-warp text-gray-800">
          Kiểm tra sản phẩm
        </h2>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
          >
            <img
              src={item.product.imageUrl || ""}
              alt={item.product.name || ""}
              className="w-20 h-20 rounded-xl object-cover bg-gray-100 border border-gray-200"
            />
            <div className="flex-1 min-w-0 py-1">
              <h3 className="font-reddit-sans font-bold text-gray-800 line-clamp-1">
                {item.product.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Số lượng: {item.quantity}
              </p>
              <p className="font-tilt-warp text-red-600">
                {formatPrice((item.product.price || 0) * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CartItemsList;
