import React from 'react'
import { CalendarDays, Hash, Phone, Store, User, X } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'
import { OrderDetailDto } from '@/types/OrderDTO'

interface OrderDetailModalProps {
    order: OrderDetailDto | null
    onClose: () => void
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
    if (!order) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 backdrop-blur-sm px-4 py-6"
            onClick={onClose}
        >
            <div
                className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.5rem] border border-white/20 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.24)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between border-b border-slate-200/80 bg-white/95 px-4 py-3.5">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            <Hash size={14} /> Đơn hàng #{order.orderId}
                        </div>
                        <h2 className="text-lg font-black text-slate-900">Chi tiết đơn hàng</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-3.5">
                        <div className="grid gap-3 grid-cols-2">
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
                        </div>
                        <div className="grid gap-3 grid-cols-2 mt-4">
                            <div>
                                <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    <CalendarDays size={12} /> Ngày đặt
                                </div>
                                <p className="text-xs font-bold text-slate-900">{new Date(order.orderDate).toLocaleString('vi-VN')}</p>
                            </div>
                            <div>
                                <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    <Store size={12} /> Địa chỉ giao hàng
                                </div>
                                <p className="text-xs font-bold text-slate-900">{order.address || 'N/A'}</p>
                            </div>
                            <div />
                        </div>
                    </div>

                    <div className="mt-3 overflow-hidden rounded-[1.1rem] border border-slate-200 bg-white">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-3.5 py-2.5">
                            <h3 className="text-xs font-black text-slate-900">Sản phẩm</h3>
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
                                                    {/* Sub-items for Set type */}
                                                    {item.subItems && item.subItems.length > 0 && (
                                                        <ul className="mt-1 space-y-0.5 pl-2 border-l-2 border-slate-200">
                                                            {item.subItems.map(sub => (
                                                                <li key={sub.productId} className="flex items-center gap-1 text-[9px] text-slate-400">
                                                                    <span className="text-slate-500 font-semibold">+</span>
                                                                    <span>{sub.productName}</span>
                                                                    <span className="ml-0.5">(x{sub.quantity})</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
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
                                <div className="p-4 text-sm text-slate-500">Không có sản phẩm nào</div>
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
                        <p className="text-xl font-black text-rose-600">{formatPrice(order.finalAmount ?? order.totalAmount)}</p>
                        {order.totalDiscount ? (
                            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                                Đã giảm: {formatPrice(order.totalDiscount)}
                            </p>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailModal
