import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'
import { OrderDetailDto, OrderItemDto } from '@/types/OrderDTO'
import { updateOrderStatus } from '@/services/orderService'

import { getSetById } from '@/services/setService'
import { ViewSetDetailDto } from '@/types/SetDTO'
interface OrderDetailModalProps {
    order: OrderDetailDto | null
    onClose: () => void
}

const OrderItem: React.FC<{ item: OrderItemDto }> = ({ item }) => {
    const [setDetails, setSetDetails] = useState<ViewSetDetailDto | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchSet = async () => {
            if (item.productName.toLowerCase().startsWith('set')) {
                try {
                    setLoading(true)
                    const details = await getSetById(item.productId)
                    setSetDetails(details)
                } catch (error) {
                    console.error('Failed to fetch set details:', error)
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchSet()
    }, [item])

    return (
        <div className="flex flex-col border-b pb-4">
            <div className="flex items-center gap-4">
                {item.imageUrl && (
                    <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-16 h-16 rounded-lg object-cover bg-gray-50 border border-gray-100"
                    />
                )}
                <div className="flex-1">
                    <p className="font-bold text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-500 font-medium">
                        SL: {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                </div>
                <p className="font-black text-red-600">{formatPrice(item.totalPrice)}</p>
            </div>

            {loading && (
                <div className="mt-2 ml-20 flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                    <span className="text-xs text-gray-400">Đang tải chi tiết set...</span>
                </div>
            )}

            {setDetails && setDetails.products && setDetails.products.length > 0 && (
                <div className="mt-3 ml-20 bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Gồm các sản phẩm:</p>
                    <div className="space-y-2">
                        {setDetails.products.map((p: any) => (
                            <div key={p.productId} className="flex items-center gap-3">
                                {p.imageUrl && (
                                    <img src={p.imageUrl} alt={p.productName} className="w-8 h-8 rounded-md object-cover bg-white" />
                                )}
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-gray-700">{p.productName}</p>
                                    <p className="text-[10px] text-gray-500">Số lượng: {p.quantity || 1}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
    if (!order) return null

    const handleMarkDelivered = async () => {
        try {
            await updateOrderStatus(order.orderId)
            // Optionally refresh order detail here or just close modal
            onClose()
        } catch (err) {
            console.error('Failed to update order status', err)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng #{order.orderId}</h2>

                <div className="mb-4 text-sm text-gray-600">
                    <p>Khách hàng: <span className="font-medium">{order.accountName}</span></p>
                    <p>Số điện thoại: {order.phoneNumber}</p>
                    <p>Ngày đặt: {new Date(order.orderDate).toLocaleString('vi-VN')}</p>
                    <p>Trạng thái: {order.status}</p>
                    <p>Kho: {order.warehouseName || 'N/A'}</p>
                </div>

                {/* Items */}
                <h3 className="font-semibold mb-2">Sản phẩm</h3>
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {order.items && order.items.length > 0 ? (
                        order.items.map(item => (
                            <OrderItem key={item.orderItemId} item={item} />
                        ))
                    ) : (
                        <p className="text-gray-500">Không có sản phẩm nào</p>
                    )}
                </div>

                {/* Invoice */}
                {order.invoice && (
                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Hóa đơn</h3>
                        <p>Mã hóa đơn: #{order.invoice.invoiceId}</p>
                        <p>Ngày xuất: {new Date(order.invoice.issuedAt).toLocaleString('vi-VN')}</p>
                        <p>Số tiền: {formatPrice(order.invoice.amountDue)}</p>
                        <p>Trạng thái: {order.invoice.status}</p>
                    </div>
                )}

                {/* Total */}
                <div className="mt-6 text-right">
                    <p className="text-lg font-bold text-red-600">
                        Tổng cộng: {formatPrice(order.totalAmount)}
                    </p>
                </div>

                {/* Mark as Delivered button */}
                {order.status === 'Đang giao hàng' && (
                    <div className="mt-6 text-right">
                        <button
                            onClick={handleMarkDelivered}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            Đã nhận hàng
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderDetailModal
