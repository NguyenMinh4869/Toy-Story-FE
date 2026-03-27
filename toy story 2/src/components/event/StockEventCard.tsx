// components/event/StockEventCard.tsx
import React from 'react'
import { Calendar, Warehouse, Package, TrendingUp, TrendingDown, Tag } from 'lucide-react'
import { StockEventDto } from '@/types/EventDto'

interface StockEventCardProps {
    event: StockEventDto
}

const StockEventCard: React.FC<StockEventCardProps> = ({ event }) => {
    const getEventColor = (eventType: string) => {
        if (eventType.includes('thêm')) return 'bg-green-100 text-green-700'
        if (eventType.includes('trừ')) return 'bg-red-100 text-red-700'
        if (eventType.includes('cập nhật')) return 'bg-yellow-100 text-yellow-700'
        if (eventType.includes('xóa')) return 'bg-orange-100 text-orange-700'
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

    const isReduction = event.quantityChanged < 0
    const isIncrease = event.quantityChanged > 0

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all hover:border-orange-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventColor(event.eventType)}`}>
                        {event.eventType}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                        <Tag size={14} />
                        {event.productName || `Sản phẩm #${event.productId}`}
                    </span>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap ml-2">
                    <Calendar size={12} />
                    {formatDate(event.createdAt)}
                </span>
            </div>

            <div className="space-y-2">
                {/* Quantity Change */}
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                        {isReduction && <TrendingDown size={14} className="text-red-500" />}
                        {isIncrease && <TrendingUp size={14} className="text-green-500" />}
                        {!isReduction && !isIncrease && <Package size={14} className="text-gray-500" />}
                        Số lượng thay đổi:
                    </span>
                    <span className={`font-bold ${isReduction ? 'text-red-600' : isIncrease ? 'text-green-600' : 'text-gray-600'}`}>
                        {isIncrease ? `+${event.quantityChanged}` : event.quantityChanged}
                    </span>
                </div>

                {/* Stock Before/After */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Tồn kho:</span>
                    <span className="font-medium">
                        <span className="text-gray-500">{event.oldQuantity}</span>
                        <span className="mx-1">→</span>
                        <span className={event.newQuantity < 10 ? 'text-red-600 font-bold' : 'text-gray-900'}>
                            {event.newQuantity}
                        </span>
                    </span>
                </div>

                {/* Warehouse */}
                {event.warehouseName && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <Warehouse size={14} className="text-gray-500" />
                        <span>Kho: {event.warehouseName}</span>
                        {event.warehouseId && (
                            <span className="text-xs text-gray-400">(ID: {event.warehouseId})</span>
                        )}
                    </div>
                )}

                {/* Reference ID */}
                {event.referenceId && (
                    <div className="text-xs text-gray-400 pt-1 border-t border-gray-100">
                        <span className="font-medium">Reference:</span> {event.referenceId}
                    </div>
                )}
            </div>
        </div>
    )
}

export default StockEventCard