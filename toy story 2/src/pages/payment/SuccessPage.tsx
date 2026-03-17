import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home, Loader2, XCircle } from "lucide-react";
import { paymentSuccess } from "../../services/checkoutService"; // Adjust path as needed

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const orderCode = searchParams.get("orderCode");
  const invoiceId = searchParams.get("id");

  useEffect(() => {
    const confirmPayment = async () => {
      if (!orderCode) {
        setError("Không tìm thấy mã đơn hàng");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Call the payment success API
        const response = await paymentSuccess(Number(orderCode));

        // Extract message from response
        const message =
          response?.data?.message ||
          response?.message ||
          "Thanh toán thành công!";

        setSuccessMessage(message);
      } catch (err: any) {
        console.error("Error confirming payment:", err);
        setError(
          err?.response?.data?.message ||
            "Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng liên hệ hỗ trợ.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    confirmPayment();
  }, [orderCode]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Đang xác nhận thanh toán
          </h1>

          <p className="text-gray-600 mb-6">
            Vui lòng không đóng hoặc tải lại trang này...
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-700">
              ⚠️ Đang cập nhật trạng thái đơn hàng của bạn. Quá trình này có thể
              mất vài giây.
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

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Có lỗi xảy ra
          </h1>

          <p className="text-gray-600 mb-6">{error}</p>

          {orderCode && (
            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">Mã đơn hàng</p>
              <p className="text-lg font-semibold text-gray-800">{orderCode}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Xem đơn hàng của tôi
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show success state
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Thanh toán thành công!
        </h1>

        <p className="text-gray-600 mb-2">
          {successMessage || "Cảm ơn bạn đã mua hàng."}
        </p>

        <p className="text-green-600 text-sm mb-6">
          Đơn hàng của bạn đã được xác nhận.
        </p>

        {/* Order Details */}
        {(orderCode || invoiceId) && (
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            {orderCode && (
              <div className="mb-2">
                <p className="text-sm text-gray-500">Mã đơn hàng</p>
                <p className="text-lg font-semibold text-gray-800">
                  {orderCode}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/profile/orders")}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold 
                     hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={20} />
            Theo dõi đơn hàng
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold 
                     hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
