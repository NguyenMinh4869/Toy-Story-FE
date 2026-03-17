// components/OrderSummary.tsx
import React from "react";
import { ShoppingBag, Ticket, Loader2, CreditCard } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { CalculatePriceResponse } from "@/types/CheckoutDTO";
interface OrderSummaryProps {
  subtotal: number;
  calculation: CalculatePriceResponse | null;
  voucherCode: string;
  voucherError: string | null;
  voucherData: any;
  isValidatingVoucher: boolean;
  isSubmitting: boolean;
  isCalculating: boolean;
  onVoucherCodeChange: (code: string) => void;
  onApplyVoucher: () => void;
  onCheckout: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  calculation,
  voucherCode,
  voucherError,
  voucherData,
  isValidatingVoucher,
  isSubmitting,
  isCalculating,
  onVoucherCodeChange,
  onApplyVoucher,
  onCheckout,
}) => {
  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-red-50 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-50 rounded-full opacity-50 blur-3xl pointer-events-none"></div>

      <h2 className="text-xl font-tilt-warp text-gray-800 mb-6 flex items-center gap-2">
        <ShoppingBag size={20} className="text-red-500" />
        Tổng kết đơn hàng
      </h2>

      <div className="space-y-4 font-reddit-sans">
        {/* Voucher Section */}
        <div className="pt-2 pb-4 border-b border-gray-100">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Ticket size={16} className="text-gray-500" /> Mã giảm giá
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => onVoucherCodeChange(e.target.value)}
              placeholder="Nhập mã voucher"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:border-red-400 focus:ring-2 focus:ring-red-50 outline-none transition-all uppercase"
              disabled={isSubmitting || isValidatingVoucher}
            />
            <button
              type="button"
              onClick={onApplyVoucher}
              disabled={
                isSubmitting || isValidatingVoucher || !voucherCode.trim()
              }
              className={`px-4 py-2 font-medium rounded-xl transition-all whitespace-nowrap ${
                !voucherCode.trim() || isValidatingVoucher
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-900 active:scale-95"
              }`}
            >
              {isValidatingVoucher ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Áp dụng"
              )}
            </button>
          </div>
          {voucherError && (
            <p className="text-red-500 text-sm mt-2">{voucherError}</p>
          )}
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tạm tính</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {voucherData && (
          <div className="flex justify-between text-green-600">
            <span className="flex flex-col">
              <span>Voucher áp dụng</span>
              <span className="text-xs text-green-500">{voucherData.name}</span>
            </span>
            <span className="font-medium">
              - {formatPrice(voucherData.totalDiscount)}
            </span>
          </div>
        )}

        {calculation && (
          <>
            <div className="flex justify-between text-gray-600">
              <span>Giảm giá</span>
              <span className="text-green-600 font-medium">
                -{formatPrice(calculation.discount)}
              </span>
            </div>
            <div className="h-px bg-gray-100 my-2"></div>
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Tổng tiền</span>
              <span className="text-red-600 text-2xl font-tilt-warp">
                {formatPrice(calculation.total)}
              </span>
            </div>
          </>
        )}

        <div className="pt-6">
          <button
            disabled={isSubmitting || isCalculating}
            onClick={onCheckout}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 ${
              isSubmitting || isCalculating
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
