import React, { useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import { useNotifications } from '@/context/NotificationContext'
import { getOrderById, getOrders } from '@/services/orderService'
import { ViewOrderDto, OrderDetailDto } from '@/types/OrderDTO'
import OrderDetail from './order/OrderDetail'
import OrderEventsModal from '@/components/event/OrderEventsModal'
import { OrderEventDto } from '@/types/EventDto'
import { getOrderEventsByOrderId } from '@/services/eventService'
import OrderList from './order/OrderList'
import Pagination from '@/components/ui/Pagination'
import { useClientPagination } from '@/hooks/useClientPagination'

const PAGE_SIZE = 6

const OrderManagementPage: React.FC = () => {
    const { lastNotificationUpdate, unreadCount, markAllRead } = useNotifications()
    const [orders, setOrders] = useState<ViewOrderDto[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<OrderDetailDto | null>(null)
    const [selectedOrderEvents, setSelectedOrderEvents] = useState<OrderEventDto[] | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const { paginatedItems: paginatedOrders, totalPages, currentPage: safePage } = useClientPagination(orders, currentPage, PAGE_SIZE)

    const fetchOrders = async () => {
        try {
            const data = await getOrders()
            setOrders(data)
            setCurrentPage(1)
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        fetchOrders()
    }, [lastNotificationUpdate])

    useEffect(() => {
        if (unreadCount > 0) markAllRead()
    }, [])

    const handleSelectOrder = async (orderId: number) => {
        try {
            const detail = await getOrderById(orderId)
            setSelectedOrder(detail)
        } catch (error) {
            console.error('Failed to fetch order detail:', error)
        }
    }

    const handleViewHistory = async (orderId: number) => {
        try {
            const events = await getOrderEventsByOrderId(orderId);
            if (events) {
                setSelectedOrderEvents(events);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    }

    return (
        <div className="min-h-[500px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-tilt-warp">
                    Quản lý Đơn Hàng
                </h2>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {orders.length} đơn hàng
                </span>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Đang tải danh sách đơn hàng...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Package size={48} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Bạn chưa có đơn hàng nào
                    </h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Khi bạn mua hàng, thông tin đơn hàng sẽ hiển thị tại đây để bạn dễ dàng theo dõi.
                    </p>
                </div>
            ) : (
                <>
                    <OrderList orders={paginatedOrders} onSelect={handleSelectOrder} onViewHistory={handleViewHistory} />
                    <div className="mt-6">
                        <Pagination
                            currentPage={safePage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </>
            )}

            {selectedOrder && !selectedOrderEvents && (
                <OrderDetail
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onRefresh={fetchOrders}
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
    )
}

export default OrderManagementPage
