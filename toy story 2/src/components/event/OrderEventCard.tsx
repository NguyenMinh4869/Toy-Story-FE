// components/event/OrderEventCard.tsx
import React from 'react'
import { Calendar, Package, Warehouse } from 'lucide-react'
import { OrderEventDto } from '@/types/EventDto'

interface OrderEventCardProps {
    event: OrderEventDto
}

const OrderEventCard: React.FC<OrderEventCardProps> = ({ event }) => {
    const getEventColor = (eventType: string) => {
        if (eventType.includes('thanh toán')) return 'bg-green-100 text-green-700'
        if (eventType.includes('bưu cục')) return 'bg-blue-100 text-blue-700'
        if (eventType.includes('giao')) return 'bg-purple-100 text-purple-700'
        if (eventType.includes('nhận')) return 'bg-emerald-100 text-emerald-700'
        if (eventType.includes('hủy')) return 'bg-red-100 text-red-700'
        return 'bg-gray-100 text-gray-700'
    }

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all hover:border-blue-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventColor(event.eventType)}`}>
                        {event.eventType}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                        <Package size={14} />
                        Đơn hàng #{event.orderId}
                    </span>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap ml-2">
                    <Calendar size={12} />
                    {formatDate(event.createdAt)}
                </span>
            </div>

            <div className="space-y-2">
                {event.warehouseName && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <Warehouse size={14} className="text-gray-500" />
                        <span>Kho: {event.warehouseName}</span>
                        {event.warehouseId && (
                            <span className="text-xs text-gray-400">(ID: {event.warehouseId})</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderEventCard