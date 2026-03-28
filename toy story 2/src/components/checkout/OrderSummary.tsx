// components/checkout/OrderSummary.tsx
import React from "react";
import { ShoppingBag, Loader2, CreditCard, Gift } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { CalculatePriceResponse } from "@/types/CheckoutDTO";

interface OrderSummaryProps {
  subtotal: number;
  calculation: CalculatePriceResponse | null;
  isSubmitting: boolean;
  isCalculating: boolean;
  onCheckout: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  calculation,
  isSubmitting,
  isCalculating,
  onCheckout,
}) => {
  // Get the summary data from calculation
  const summary = calculation?.summary;

  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-red-50 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-50 rounded-full opacity-50 blur-3xl pointer-events-none"></div>

      <h2 className="text-xl font-tilt-warp text-gray-800 mb-6 flex items-center gap-2">
        <ShoppingBag size={20} className="text-red-500" />
        Tổng kết đơn hàng
      </h2>

      <div className="space-y-4 font-reddit-sans">
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Promotions Section - Display each discount */}
        {summary?.discounts && summary.discounts.length > 0 && (
          <>
            {summary.discounts.map((discount, index) => (
              <div key={index} className="flex justify-between text-green-600">
                <div className="flex items-center gap-2">
                  <Gift size={16} />
                  <span>{discount.name}</span>
                </div>
                <span className="font-medium">
                  -{formatPrice(discount.amount)}
                </span>
              </div>
            ))}
          </>
        )}

        <div className="h-px bg-gray-100 my-2"></div>

        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Tổng tiền</span>
          <div className="text-right">
            {summary?.finalAmount !== undefined ? (
              <span className="text-red-600 text-2xl font-tilt-warp">
                {formatPrice(summary.finalAmount)}
              </span>
            ) : (
              <Loader2 size={20} className="animate-spin text-gray-400" />
            )}

          </div>
        </div>

        {/* Total discount saved */}
        {summary?.totalDiscount && summary.totalDiscount > 0 && (
          <p className="text-sm text-green-600 text-right">
            Tiết kiệm: {formatPrice(summary.totalDiscount)}
          </p>
        )}

        <div className="pt-6">
          <button
            disabled={isSubmitting || isCalculating}
            onClick={onCheckout}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 ${isSubmitting || isCalculating
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700 hover:shadow-red-200"
              }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <CreditCard size={24} />
                Thanh toán ngay (PayOS)
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="p-2 bg-green-50 rounded-full">
            <CreditCard size={14} className="text-green-600" />
          </div>
          <p>
            Thanh toán an toàn qua cổng PayOS với mã QR hoặc chuyển khoản ngân
            hàng.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OrderSummary;