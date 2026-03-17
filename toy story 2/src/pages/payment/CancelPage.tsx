import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle, Loader2, ShoppingCart, Home } from "lucide-react";
import { paymentCancel } from "../../services/checkoutService"; // Adjust path as needed

const PaymentCancelPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  const orderCode = searchParams.get("orderCode");

  useEffect(() => {
    const processCancellation = async () => {
      if (!orderCode) {
        setError("Không tìm thấy mã đơn hàng");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Call the payment cancel API
        const response = await paymentCancel(Number(orderCode));

        // Extract message from response
        const message =
          response?.data?.message ||
          response?.message ||
          "Đã hủy thanh toán thành công";

        setCancelMessage(message);
      } catch (err: any) {
        console.error("Error cancelling payment:", err);
        setError(
          err?.response?.data?.message || "Có lỗi xảy ra khi hủy thanh toán.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    processCancellation();
  }, [orderCode]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Loader2 className="w-12 h-12 text-yellow-600 animate-spin" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Đang xử lý hủy đơn
          </h1>

          <p className="text-gray-600 mb-6">
            Vui lòng không đóng hoặc tải lại trang này...
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-700">
              ⚠️ Đang cập nhật trạng thái hủy đơn hàng của bạn.
            </p>
          </div>

          {orderCode && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Mã đơn hàng</p>
              <p className="text-lg font-semibold text-gray-800">{orderCode}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {error ? "Có lỗi xảy ra" : "Thanh toán đã bị hủy"}
        </h1>

        <p className="text-gray-600 mb-6">
          {error ||
            cancelMessage ||
            "Bạn đã hủy quá trình thanh toán. Đơn hàng của bạn chưa được xác nhận."}
        </p>

        {orderCode && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Mã đơn hàng</p>
            <p className="text-lg font-semibold text-gray-800">{orderCode}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            Thử lại thanh toán
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            Quay lại giỏ hàng
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-transparent text-gray-600 py-2 hover:text-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
