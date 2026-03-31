import React from 'react'
import { Clock, TriangleAlert } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'
import { ViewOrderDto } from '@/types/OrderDTO'
import StatusBadge from '@/components/badge/OrderStatusBadge'

interface OrderCardProps {
  order: ViewOrderDto
  onClick?: () => void
  onViewHistory?: (orderId: number) => void
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick, onViewHistory }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-red-100 transition-all cursor-pointer flex flex-col gap-4"
    >
      {/* First row: Order ID + Date + Warnings */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-gray-900 text-lg truncate">
            Đơn hàng #{order.orderId}
          </h4>
          <span className="flex items-center gap-1 text-sm text-gray-500">

            <StatusBadge status={order.status} />

          </span>
        </div>
      </div>

      {/* Second row: Status + Price */}
      <div className="border-t border-gray-50 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <Clock size={14} />
          {new Date(order.orderDate).toLocaleDateString('vi-VN')}
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            Tổng tiền
          </p>
          <div className="text-xl font-black text-red-600">
            {formatPrice(order.finalAmount ?? order.totalAmount ?? 0)}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {order.manuallyAssign && (
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-3xl text-sm">
            <TriangleAlert />
            <span>Vui lòng gán kho</span>
          </div>
        )}
        {order.isDelivered && (
          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-3xl text-sm">
            <TriangleAlert />
            <span>Đang chờ kho xác nhận</span>
          </div>
        )}

        {order.status !== 'Đang chờ thanh toán' && order.status !== 'Đã hủy' && (
          <button
            onClick={async (e) => {
              e.stopPropagation();
              onViewHistory?.(order.orderId);
            }}
            className={`px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all ${(order.manuallyAssign || order.isDelivered) ? '' : 'w-full'
              }`}          >
            Xem lịch sử
          </button>
        )}
      </div>
    </div>
  );
}

export default OrderCard
