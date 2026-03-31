import React, { useState } from 'react'
import { CalendarDays, Hash, Phone, Store, User } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'
import { OrderDetailDto } from '@/types/OrderDTO'
import { getWarehouses } from '@/services/warehouseService'
import { assignWarehouse, updateOrderStatus } from '@/services/orderService'
import { WarehouseSummaryDto } from '@/types/WarehouseDTO'
import { useAuth } from '@/hooks/useAuth'
interface OrderDetailProps {
  order: OrderDetailDto | null
  onClose: () => void
  onRefresh?: () => void
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, onClose, onRefresh }) => {
  const [warehouses, setWarehouses] = useState<WarehouseSummaryDto[]>([])
  const [loadingWarehouses, setLoadingWarehouses] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null)
  const { user } = useAuth()
  if (!order) return null

  const handleFetchWarehouses = async () => {
    setLoadingWarehouses(true)
    try {
      const data = await getWarehouses()
      setWarehouses(data)
    } finally {
      setLoadingWarehouses(false)
    }
  }

  const handleAssign = async () => {
    if (!selectedWarehouse) return
    await assignWarehouse(order.orderId, selectedWarehouse)
    if (onRefresh) {
      onRefresh()
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 backdrop-blur-sm px-4 py-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.5rem] border border-white/20 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.24)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between border-b border-slate-200/80 bg-white/95 px-4 py-3.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <Hash size={14} /> Đơn hàng #{order.orderId}
          </div>
          <div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-md font-bold ${String(order.status).toLowerCase().includes('giao')
                ? 'bg-emerald-100 text-emerald-700'
                : String(order.status).toLowerCase().includes('hủy')
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-amber-100 text-amber-700'
                }`}
            >
              {order.status}
            </span>
          </div>

        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-3.5">
            <div className="grid gap-3 grid-cols-3">
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
                <p className="text-xs font-bold text-slate-900">{new Date(order.orderDate).toLocaleString('vi-VN')}</p>
              </div>
            </div>
            <div className="grid gap-3 grid-cols-2 mt-4">
              <div>
                <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <Store size={12} /> Địa chỉ giao hàng
                </div>
                <p className="text-xs font-bold text-slate-900">{order.address || 'N/A'}</p>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <Store size={12} /> Kho
                </div>
                <p className="text-xs font-bold text-slate-900">{order.warehouseName || 'N/A'}</p>
              </div>
              <div />
            </div>
          </div>

          {order.warehouseId == null && (
            <div className="mt-3 rounded-[1.1rem] border border-dashed border-blue-200 bg-blue-50/60 p-2.5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-xs font-black text-slate-900">Gán kho xử lý</h3>
                <div className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                  {warehouses.length > 0 ? 'Đã tải' : 'Chưa tải'}
                </div>
              </div>

              {warehouses.length === 0 ? (
                <button
                  onClick={handleFetchWarehouses}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-blue-700"
                >
                  {loadingWarehouses ? 'Đang tải...' : 'Tải danh sách kho'}
                </button>
              ) : (
                <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_150px]">
                  <select
                    value={selectedWarehouse ?? ''}
                    onChange={(e) => setSelectedWarehouse(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">-- Chọn kho --</option>
                    {warehouses.map(w => (
                      <option key={w.warehouseId} value={w.warehouseId}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                  <button
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
            <div className="flex items-center justify-between border-b border-slate-200 px-3.5 py-2.5 bg-slate-50/70">
              <div>
                <h3 className="text-xs font-black text-slate-900">Sản phẩm</h3>
              </div>
              <div className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                {order.items?.length || 0} mục
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items && order.items.length > 0 ? (
                order.items.map(item => (
                  <div key={item.orderItemId} className="flex gap-2.5 px-3.5 py-2.5">
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
                          <p className="truncate text-[11px] font-bold text-slate-900">{item.productName}</p>
                          <p className="mt-0.5 text-[10px] text-slate-500">SL: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-black text-rose-600">{formatPrice(item.totalPrice)}</p>
                          {item.totalOriginalPrice && item.totalOriginalPrice > item.totalPrice ? (
                            <p className="text-[9px] font-medium text-slate-400 line-through mt-0.5">{formatPrice(item.totalOriginalPrice)}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5 text-[9px] text-slate-500">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5">ĐG: {formatPrice(item.unitPrice)}</span>
                        {item.originalUnitPrice && item.originalUnitPrice > item.unitPrice ? (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 line-through decoration-slate-400 text-slate-400">Gốc: {formatPrice(item.originalUnitPrice)}</span>
                        ) : null}
                        <span className="rounded-full bg-slate-100 px-2 py-0.5">Tổng: {formatPrice(item.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                ))
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
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">Mã hóa đơn</p>
                  <p className="mt-0.5 text-[11px] font-bold text-slate-900">#{order.invoice.invoiceId}</p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">Ngày xuất</p>
                  <p className="mt-0.5 text-[11px] font-bold text-slate-900">{new Date(order.invoice.issuedAt).toLocaleString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">Số tiền</p>
                  <p className="mt-0.5 text-[11px] font-bold text-slate-900">{formatPrice(order.invoice.amountDue)}</p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">Trạng thái</p>
                  <p className="mt-0.5 text-[11px] font-bold text-slate-900">{order.invoice.status}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-white px-4 py-3.5">
          <div>
            <p className="text-xs text-slate-500">Tổng cộng {order.totalDiscount ? '(sau giảm giá)' : ''}</p>
            <p className="text-xl font-black text-rose-600">{formatPrice(order.finalAmount ?? order.totalAmount ?? 0)}</p>
            {order.totalDiscount ? (
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                Đã giảm: {formatPrice(order.totalDiscount)}
              </p>
            ) : null}
          </div>

          {order.isDelivered && user?.role === 'Staff' && (
            <button
              onClick={async () => {
                try {
                  await updateOrderStatus(order.orderId);
                  if (onRefresh) {
                    onRefresh();
                  }
                  onClose();
                } catch (error) {
                  console.error('Failed to update order status:', error);
                }
              }}
              className="mt-2 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-3xl text-sm font-bold hover:bg-green-700 transition-colors"
            >
              Xác nhận giao hàng
            </button>
          )}
        </div>
      </div>
    </div >
  )
}

export default OrderDetail
