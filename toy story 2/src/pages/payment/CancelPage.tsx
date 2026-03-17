import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentCancelPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderCode = searchParams.get("orderCode");

  useEffect(() => {
    // You could call an API here to update order status if needed
    console.log("Payment cancelled for order:", orderCode);
  }, [orderCode]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <XCircle className="w-20 h-20 text-red-500 mx-auto" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Thanh toán đã bị hủy
        </h1>

        <p className="text-gray-600 mb-6">
          Bạn đã hủy quá trình thanh toán. Đơn hàng của bạn chưa được xác nhận.
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
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Thử lại thanh toán
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Quay lại giỏ hàng
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-transparent text-gray-600 py-2 hover:text-gray-800 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
