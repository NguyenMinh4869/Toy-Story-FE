import React, { useEffect, useState } from 'react'
import ProfileLayout from '../layouts/ProfileLayout'
import { ShoppingBag, Package, Clock } from 'lucide-react'
import { formatPrice } from '../utils/formatPrice'
import { Link } from 'react-router-dom'
import { getOrderById, getAccountOrders, updateOrderStatus } from '@/services/orderService'
import StatusBadge from '@/components/badge/OrderStatusBadge'
import { OrderDetailDto } from '@/types/OrderDTO'
import OrderDetailModal from '@/components/OrderDetailModalProps'
import { getOrderEventsByOrderId } from '@/services/eventService'
import { OrderEventDto } from '@/types/EventDto'
import OrderEventsModal from '@/components/event/OrderEventsModal'

const OrderPage: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [selectedOrder, setSelectedOrder] = useState<OrderDetailDto | null>(null)
    const [selectedOrderEvents, setSelectedOrderEvents] = useState<OrderEventDto[] | null>(null)

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
                                className="group bg-white border border-gray-200 rounded-2xl shadow-md p-6 hover:shadow-xl hover:border-red-100 transition-all cursor-pointer"
                            >
                                {/* Top section: icon + info */}
                                <div className="flex flex-col gap-2">
                                    {/* First row: Order ID + Date */}
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-gray-900 text-lg">
                                            Đơn hàng #{order.orderId}
                                        </h4>
                                        <span className="flex items-center gap-1 text-sm text-gray-500">
                                            <Clock size={14} />
                                            {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>

                                    {/* Second row: Status + Price */}
                                    <div className="flex items-center justify-between">
                                        <StatusBadge status={order.status} />
                                        <div className="text-xl font-extrabold tracking-tight text-red-600">
                                            {formatPrice(order.finalAmount ?? order.totalAmount ?? 0)}
                                        </div>
                                    </div>
                                </div>


                                <div className="mt-4 flex justify-center gap-6">
                                    {order.status === 'Đang giao hàng' && (
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                try {
                                                    await updateOrderStatus(order.orderId);
                                                    setOrders(prev =>
                                                        prev.map(o => o.orderId === order.orderId
                                                            ? { ...o, status: 'Đã nhận hàng' }
                                                            : o
                                                        )
                                                    );
                                                } catch (error) {
                                                    console.error(error);
                                                }
                                            }}
                                            className="px-6 py-2 bg-green-600 text-white rounded-full text-sm font-bold hover:bg-green-700 transition-all"
                                        >
                                            Nhận hàng
                                        </button>
                                    )}

                                    {order.status !== 'Đang chờ thanh toán' && order.status !== 'Đã hủy' && (
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                try {
                                                    const events = await getOrderEventsByOrderId(order.orderId);
                                                    if (events) {
                                                        setSelectedOrderEvents(events);
                                                    }
                                                } catch (error) {
                                                    console.error('Failed to fetch events:', error);
                                                }
                                            }}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all"
                                        >
                                            Xem lịch sử
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedOrder && !selectedOrderEvents && (
                    <OrderDetailModal
                        order={selectedOrder}
                        onClose={() => setSelectedOrder(null)}
                    />
                )}

                {selectedOrderEvents && (
                    <OrderEventsModal
                        orderId={selectedOrderEvents[0]?.orderId}
                        events={selectedOrderEvents}
                        onClose={() => {
                            setSelectedOrderEvents(null);
                        }}
                    />
                )}
            </div>

        </ProfileLayout>
    )
}

export default OrderPage
