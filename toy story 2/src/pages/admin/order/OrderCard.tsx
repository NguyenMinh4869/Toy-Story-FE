import React from 'react'
import { Clock, TriangleAlert } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'
import { ViewOrderDto } from '@/types/OrderDTO'
import StatusBadge from '@/components/badge/OrderStatusBadge'

interface OrderCardProps {
  order: ViewOrderDto
  onClick?: () => void
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-red-100 transition-all cursor-pointer flex flex-col gap-4"
    >
      {/* Header Section: Icon & Order Info */}
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-lg mb-1 truncate">
            Đơn hàng #{order.orderId}
          </h4>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {new Date(order.orderDate).toLocaleDateString('vi-VN')}
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            {order.manuallyAssign && (
              <div className="flex items-center gap-2 bg-red-100 text-red-700 p-2 rounded-3xl">
                <TriangleAlert />
                <span >
                  Vui lòng gán kho
                </span>
              </div>
            )}
            {order.isDelivered && (
              <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 p-2 rounded-3xl">
                <TriangleAlert />
                <span >
                  Đang chờ kho xác nhận
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section: Pricing & Status */}
      <div className="border-t border-gray-50 flex items-center justify-between mt-auto">
        <StatusBadge status={order.status} />
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Tổng tiền</p>
          <div className="text-xl font-black text-red-600">
            {formatPrice(order.totalAmount)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCard
