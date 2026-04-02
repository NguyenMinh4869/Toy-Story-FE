// CheckoutPage/index.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ROUTES } from "../routes/routePaths";

import { useCheckout } from "@/hooks/useCheckout";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CartItemsList from "@/components/checkout/CartItemsList";
import OrderSummary from "@/components/checkout/OrderSummary";
import EmptyCart from "@/components/checkout/EmptyCart";
import { useAuth } from "@/hooks/useAuth";
const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalOriginalPrice } = useCart();

  const {
    formData,
    isSubmitting,
    isCalculating,
    calculation,
    error,
    handleCheckout,
  } = useCheckout();

  const { role } = useAuth();
  if (role !== "Member") {
    navigate(ROUTES.HOME);
    return null;
  }
  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !isSubmitting) {
      const timer = setTimeout(() => {
        if (cartItems.length === 0) navigate(ROUTES.HOME);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [cartItems, navigate, isSubmitting]);

  if (cartItems.length === 0 && !isSubmitting) {
    return <EmptyCart />;
  }

  return (
    <div className="bg-[#fff9fa] min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-3xl font-tilt-warp text-gray-900">Thanh toán</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CheckoutForm formData={formData} />
            <CartItemsList items={cartItems} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <OrderSummary
                subtotal={getTotalOriginalPrice()}
                calculation={calculation}
                isSubmitting={isSubmitting}
                isCalculating={isCalculating}
                onCheckout={handleCheckout}
              />

              <button
                onClick={() => navigate(ROUTES.HOME)}
                className="w-full py-3 text-gray-500 font-reddit-sans hover:text-red-600 transition-colors flex items-center justify-center gap-2"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
