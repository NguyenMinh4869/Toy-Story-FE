import React, { useEffect, useState } from 'react'
import ProfileLayout from '../layouts/ProfileLayout'
import { ShoppingBag, Package, ChevronRight, Clock } from 'lucide-react'
import { formatPrice } from '../utils/formatPrice'
import { Link } from 'react-router-dom'
import { getOrderById, getAccountOrders, updateOrderStatus } from '@/services/orderService'
import StatusBadge from '@/components/badge/OrderStatusBadge'
import { OrderDetailDto } from '@/types/OrderDTO'
import OrderDetailModal from '@/components/OrderDetailModalProps'

const OrderPage: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<OrderDetailDto | null>(null)
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getAccountOrders()
                setOrders(data)
            } catch (error) {
                console.error('Error fetching orders:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])


    return (
        <ProfileLayout>
            <div className="min-h-[500px]">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[#00247d] text-2xl font-bold font-tilt-warp">
                        Lịch Sử Đơn Hàng
                    </h2>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {orders.length} đơn hàng
                    </span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-reddit-sans">Đang tải lịch sử của bạn...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <Package size={48} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-red-hat">
                            Bạn chưa có đơn hàng nào
                        </h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto font-reddit-sans">
                            Khi bạn mua hàng, thông tin đơn hàng sẽ hiển thị tại đây để bạn dễ dàng theo dõi.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-[#ab0007] text-white rounded-xl font-bold hover:bg-[#8a0006] transition-all shadow-lg no-underline"
                        >
                            <ShoppingBag size={20} />
                            Khám phá sản phẩm ngay
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {orders.map((order) => (
                            <div
                                key={order.orderId}
                                onClick={async () => {
                                    try {
                                        const detail = await getOrderById(order.orderId)
                                        setSelectedOrder(detail)
                                    } catch (error) {
                                        console.error('Failed to fetch order detail:', error)
                                    }
                                }}
                                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-red-100 transition-all cursor-pointer"
                            >
                                {/* Top section: icon + info */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shrink-0">
                                        <Package size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 text-lg mb-1">
                                            Đơn hàng #{order.orderId}
                                        </h4>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                            </span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span>{order.accountName || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-right">
                                        <div className="text-lg font-black text-red-600 mb-1">
                                            {formatPrice(order.totalAmount)}
                                        </div>

                                        <StatusBadge status={order.status} />

                                        {order.status === 'Đang giao hàng' && (
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await updateOrderStatus(order.orderId)
                                                        setOrders(prev =>
                                                            prev.map(o =>
                                                                o.orderId === order.orderId
                                                                    ? { ...o, status: 'Đã nhận hàng' }
                                                                    : o
                                                            )
                                                        )
                                                    } catch (error) {
                                                        console.error('Failed to update order status:', error)
                                                    }
                                                }}
                                                className="mt-2 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
                                            >
                                                Đã nhận hàng
                                            </button>
                                        )}
                                    </div>
                                    <ChevronRight
                                        size={20}
                                        className="text-gray-300 group-hover:text-red-600 transition-colors"
                                    />
                                </div>

                            </div>
                        ))}
                    </div>

                )}
                {selectedOrder && (
                    <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
                )}
            </div>

        </ProfileLayout>
    )
}

export default OrderPage
