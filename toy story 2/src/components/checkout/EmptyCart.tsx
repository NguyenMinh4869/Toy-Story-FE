// components/EmptyCart.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { ROUTES } from "@/routes/routePaths";

const EmptyCart: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <ShoppingBag size={48} className="text-red-500" />
      </div>
      <h2 className="text-2xl font-tilt-warp text-gray-800 mb-2">
        Giỏ hàng của bạn đang trống
      </h2>
      <p className="text-gray-600 mb-8">
        Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.
      </p>
      <button
        onClick={() => navigate(ROUTES.PRODUCTS)}
        className="bg-red-600 text-white px-8 py-3 rounded-full font-reddit-sans hover:bg-red-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
      >
        Tiếp tục mua sắm
      </button>
    </div>
  );
};

export default EmptyCart;
