import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Package } from "lucide-react";
import ProfileLayout from "@/layouts/ProfileLayout";
import { getOrderById } from "@/services/orderService";
import { OrderDetailDto } from "@/types/OrderDTO";
import OrderForm, { OrderFormMode } from "@/components/order/OrderForm";

function inferMode(pathname: string): OrderFormMode {
  if (pathname.startsWith("/admin/")) return "admin";
  if (pathname.startsWith("/staff/")) return "staff";
  return "customer";
}

const OrderDetailPage: React.FC = () => {
  const { orderId: orderIdParam } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const mode = useMemo(() => inferMode(location.pathname), [location.pathname]);

  const [order, setOrder] = useState<OrderDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = Number(orderIdParam);
  const validId = Number.isFinite(orderId) && orderId > 0;

  useEffect(() => {
    if (!validId) {
      setLoading(false);
      setError("Mã đơn hàng không hợp lệ.");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getOrderById(orderId)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Không tải được chi tiết đơn hàng.");
          setOrder(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orderId, validId]);

  const backTarget =
    mode === "admin"
      ? "/admin/orders"
      : mode === "staff"
        ? "/staff/orders"
        : "/profile/orders";

  const handleBack = () => navigate(backTarget);

  const inner = (
    <div className="min-h-[400px] py-2">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
          <p className="text-gray-500">Đang tải chi tiết đơn hàng...</p>
        </div>
      ) : error || !order ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
          <Package className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="text-gray-600">{error ?? "Không tìm thấy đơn hàng."}</p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-6 rounded-full bg-[#ab0007] px-6 py-2 text-sm font-bold text-white hover:bg-[#8a0006]"
          >
            Quay lại danh sách
          </button>
        </div>
      ) : (
        <OrderForm order={order} mode={mode} showBack onBack={handleBack} onRefresh={() => {
          getOrderById(order.orderId).then(setOrder).catch(() => {});
        }} />
      )}
    </div>
  );

  if (mode === "customer") {
    return <ProfileLayout>{inner}</ProfileLayout>;
  }

  return inner;
};

export default OrderDetailPage;
