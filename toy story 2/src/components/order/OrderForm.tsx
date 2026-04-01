import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Hash, Phone, Store, User } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/formatPrice";
import { OrderDetailDto } from "@/types/OrderDTO";
import { getWarehouses } from "@/services/warehouseService";
import { assignWarehouse, updateOrderStatus } from "@/services/orderService";
import { getSetById } from "@/services/setService";
import { WarehouseSummaryDto } from "@/types/WarehouseDTO";
import { useAuth } from "@/hooks/useAuth";
import type { ViewSetDetailDto } from "@/types/SetDTO";
import { ROUTES } from "@/routes/routePaths";

export type OrderFormMode = "customer" | "admin" | "staff";

export interface OrderFormProps {
  order: OrderDetailDto;
  mode: OrderFormMode;
  /** Trang đầy đủ: hiển thị nút quay lại */
  showBack?: boolean;
  onBack?: () => void;
  onRefresh?: () => void;
}

function collectSetIds(order: OrderDetailDto): number[] {
  const ids: number[] = [];
  if (order.setId != null && order.setId > 0) ids.push(order.setId);
  for (const item of order.items ?? []) {
    if (item.setId != null && item.setId > 0) ids.push(item.setId);
  }
  return [...new Set(ids)];
}

const OrderForm: React.FC<OrderFormProps> = ({
  order,
  mode,
  showBack = true,
  onBack,
  onRefresh,
}) => {
  const [warehouses, setWarehouses] = useState<WarehouseSummaryDto[]>([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
  const [setDetailsById, setSetDetailsById] = useState<Record<number, ViewSetDetailDto>>({});
  const [loadingSets, setLoadingSets] = useState(false);
  const { user } = useAuth();

  const setIds = useMemo(() => collectSetIds(order), [order]);

  useEffect(() => {
    if (setIds.length === 0) {
      setSetDetailsById({});
      return;
    }
    let cancelled = false;
    setLoadingSets(true);
    Promise.all(
      setIds.map((id) =>
        getSetById(id).then(
          (d) => [id, d] as const,
          () => [id, null] as const
        )
      )
    )
      .then((entries) => {
        if (cancelled) return;
        const next: Record<number, ViewSetDetailDto> = {};
        for (const [id, d] of entries) {
          if (d) next[id] = d;
        }
        setSetDetailsById(next);
      })
      .finally(() => {
        if (!cancelled) setLoadingSets(false);
      });
    return () => {
      cancelled = true;
    };
  }, [order.orderId, setIds]);

  const showWarehouseAssign = mode !== "customer" && order.warehouseId == null;
  const showStaffDelivery =
    mode !== "customer" && order.isDelivered && user?.role === "Staff";

  const handleFetchWarehouses = async () => {
    setLoadingWarehouses(true);
    try {
      const data = await getWarehouses();
      setWarehouses(data);
    } finally {
      setLoadingWarehouses(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedWarehouse) return;
    await assignWarehouse(order.orderId, selectedWarehouse);
    onRefresh?.();
    onBack?.();
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col">
      {showBack && onBack && (
        <div className="mb-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Quay lại
          </button>
        </div>
      )}

      <div className="flex flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <div className="flex justify-between border-b border-slate-200/80 bg-white/95 px-4 py-3.5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <Hash size={14} /> Đơn hàng #{order.orderId}
            </div>
            {mode === "customer" && (
              <h1 className="text-lg font-black text-slate-900">Chi tiết đơn hàng</h1>
            )}
          </div>
          <div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-md font-bold ${String(order.status)
                .toLowerCase()
                .includes("giao")
                ? "bg-emerald-100 text-emerald-700"
                : String(order.status).toLowerCase().includes("hủy")
                  ? "bg-rose-100 text-rose-700"
                  : "bg-amber-100 text-amber-700"}`}
            >
              {order.status}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-3.5">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <User size={12} /> Khách hàng
                </div>
                <p className="text-xs font-bold text-slate-900">{order.accountName}</p>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <Phone size={12} /> Số điện thoại
                </div>
                <p className="text-xs font-bold text-slate-900">{order.phoneNumber}</p>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <CalendarDays size={12} /> Ngày đặt
                </div>
                <p className="text-xs font-bold text-slate-900">
                  {new Date(order.orderDate).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <Store size={12} /> Địa chỉ giao hàng
                </div>
                <p className="text-xs font-bold text-slate-900">{order.address || "N/A"}</p>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <Store size={12} /> Kho
                </div>
                <p className="text-xs font-bold text-slate-900">{order.warehouseName || "N/A"}</p>
              </div>
            </div>
          </div>

          {order.setId != null && order.setId > 0 && (
            <div className="mt-3 rounded-[1.1rem] border border-indigo-200 bg-indigo-50/50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-xs font-black text-slate-900">Sản phẩm trong bộ</h3>
                {loadingSets ? (
                  <span className="text-[10px] text-slate-500">Đang tải...</span>
                ) : (
                  <Link
                    to={ROUTES.SET_DETAIL.replace(":id", String(order.setId))}
                    className="text-[10px] font-bold text-indigo-700 underline-offset-2 hover:underline"
                  >
                    Xem bộ trên shop
                  </Link>
                )}
              </div>
              {setDetailsById[order.setId]?.products && setDetailsById[order.setId]!.products!.length > 0 ? (
                <ul className="divide-y divide-indigo-100 rounded-lg border border-indigo-100 bg-white">
                  {setDetailsById[order.setId]!.products!.map((p) => (
                    <li key={`${order.setId}-${p.productId}`} className="flex items-center gap-2 px-2 py-1.5 text-[11px]">
                      <span className="min-w-0 flex-1 truncate font-semibold text-slate-800">
                        {p.productName}
                      </span>
                      <span className="text-slate-500">×{p.quantity}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-slate-500">
                  {loadingSets ? "Đang tải danh sách sản phẩm..." : "Không có dữ liệu sản phẩm trong bộ."}
                </p>
              )}
            </div>
          )}

          {showWarehouseAssign && (
            <div className="mt-3 rounded-[1.1rem] border border-dashed border-blue-200 bg-blue-50/60 p-2.5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-xs font-black text-slate-900">Gán kho xử lý</h3>
                <div className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                  {warehouses.length > 0 ? "Đã tải" : "Chưa tải"}
                </div>
              </div>

              {warehouses.length === 0 ? (
                <button
                  type="button"
                  onClick={handleFetchWarehouses}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-blue-700"
                >
                  {loadingWarehouses ? "Đang tải..." : "Tải danh sách kho"}
                </button>
              ) : (
                <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_150px]">
                  <select
                    value={selectedWarehouse ?? ""}
                    onChange={(e) => setSelectedWarehouse(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">-- Chọn kho --</option>
                    {warehouses.map((w) => (
                      <option key={w.warehouseId} value={w.warehouseId}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAssign}
                    disabled={!selectedWarehouse}
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Xác nhận gán kho
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-3 overflow-hidden rounded-[1.1rem] border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-3.5 py-2.5">
              <div>
                <h3 className="text-xs font-black text-slate-900">Sản phẩm</h3>
              </div>
              <div className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                {order.items?.length || 0} mục
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => {
                  const lineSetId = item.setId != null && item.setId > 0 ? item.setId : null;
                  const setDetail = lineSetId != null ? setDetailsById[lineSetId] : undefined;
                  const showLineSetBreakdown =
                    lineSetId != null &&
                    order.setId !== lineSetId &&
                    setDetail?.products &&
                    setDetail.products.length > 0;

                  return (
                    <div key={item.orderItemId}>
                      <div className="flex gap-2.5 px-3.5 py-2.5">
                        <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="h-full w-full object-cover object-center"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[8px] font-bold leading-none text-slate-400">
                              No
                              <br />
                              img
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="truncate text-[11px] font-bold text-slate-900">
                                {item.productName}
                              </p>
                              <p className="mt-0.5 text-[10px] text-slate-500">SL: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[11px] font-black text-rose-600">
                                {formatPrice(item.totalPrice)}
                              </p>
                              {item.totalOriginalPrice && item.totalOriginalPrice > item.totalPrice ? (
                                <p className="mt-0.5 text-[9px] font-medium text-slate-400 line-through">
                                  {formatPrice(item.totalOriginalPrice)}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="mt-1.5 flex flex-wrap gap-1.5 text-[9px] text-slate-500">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5">
                              ĐG: {formatPrice(item.unitPrice)}
                            </span>
                            {item.originalUnitPrice && item.originalUnitPrice > item.unitPrice ? (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-400 line-through decoration-slate-400">
                                Gốc: {formatPrice(item.originalUnitPrice)}
                              </span>
                            ) : null}
                            <span className="rounded-full bg-slate-100 px-2 py-0.5">
                              Tổng: {formatPrice(item.totalPrice)}
                            </span>
                            {lineSetId != null && (
                              <Link
                                to={ROUTES.SET_DETAIL.replace(":id", String(lineSetId))}
                                className="rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700"
                              >
                                Bộ #{lineSetId}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                      {showLineSetBreakdown && (
                        <div className="border-t border-slate-100 bg-slate-50/80 px-3.5 py-2">
                          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            Sản phẩm trong bộ
                          </p>
                          <ul className="space-y-1">
                            {setDetail!.products!.map((p) => (
                              <li
                                key={`${item.orderItemId}-${p.productId}`}
                                className="flex text-[10px] text-slate-700"
                              >
                                <span className="min-w-0 flex-1 truncate">{p.productName}</span>
                                <span className="text-slate-500">×{p.quantity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-5 text-sm text-slate-500">Không có sản phẩm nào</div>
              )}
            </div>
          </div>

          {order.invoice && (
            <div className="mt-3 rounded-[1rem] border border-slate-200 bg-slate-50/60 p-2.5">
              <h3 className="mb-2 text-xs font-black text-slate-900">Hóa đơn</h3>
              <div className="grid gap-1.5 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Mã hóa đơn
                  </p>
                  <p className="mt-0.5 text-[11px] font-bold text-slate-900">
                    #{order.invoice.invoiceId}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Ngày xuất
                  </p>
                  <p className="mt-0.5 text-[11px] font-bold text-slate-900">
                    {new Date(order.invoice.issuedAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Số tiền
                  </p>
                  <p className="mt-0.5 text-[11px] font-bold text-slate-900">
                    {formatPrice(order.invoice.amountDue)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Trạng thái
                  </p>
                  <p className="mt-0.5 text-[11px] font-bold text-slate-900">{order.invoice.status}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-white px-4 py-3.5">
          <div>
            <p className="text-xs text-slate-500">
              Tổng cộng {order.totalDiscount ? "(sau giảm giá)" : ""}
            </p>
            <p className="text-xl font-black text-rose-600">
              {formatPrice(order.finalAmount ?? order.totalAmount ?? 0)}
            </p>
            {order.totalDiscount ? (
              <p className="mt-0.5 text-[11px] font-semibold text-emerald-600">
                Đã giảm: {formatPrice(order.totalDiscount)}
              </p>
            ) : null}
          </div>

          {showStaffDelivery && (
            <button
              type="button"
              onClick={async () => {
                try {
                  await updateOrderStatus(order.orderId);
                  onRefresh?.();
                  onBack?.();
                } catch (error) {
                  console.error("Failed to update order status:", error);
                }
              }}
              className="mt-2 inline-flex items-center rounded-3xl bg-green-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-700"
            >
              Xác nhận giao hàng
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
