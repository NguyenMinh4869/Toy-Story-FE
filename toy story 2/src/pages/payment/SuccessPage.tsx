import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderCode = searchParams.get("orderCode");
  const invoiceId = searchParams.get("id");

  useEffect(() => {
    // You could call an API here to confirm order
    console.log(
      "Payment successful for order:",
      orderCode,
      "invoice:",
      invoiceId,
    );
  }, [orderCode, invoiceId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Thanh toán thành công!
        </h1>

        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
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
            {invoiceId && (
              <div>
                <p className="text-sm text-gray-500">Mã hóa đơn</p>
                <p className="text-lg font-semibold text-gray-800">
                  {invoiceId}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/orders")}
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
