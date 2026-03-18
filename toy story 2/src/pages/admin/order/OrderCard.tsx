import React from 'react'
import { Package, Clock } from 'lucide-react'
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
      className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-red-100 transition-all cursor-pointer"
    >
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
      {order.manuallyAssign && (
        <div className="mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1 rounded"
          >
            Gán kho cho đơn hàng
          </button>
          <p className="text-xs text-gray-500 mt-1">
            Đơn hàng này chưa có kho, vui lòng gán kho để xử lý.
          </p>
        </div>
      )}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-right">
          <div className="text-lg font-black text-red-600 mb-1">
            {formatPrice(order.totalAmount)}
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>
    </div>
  )
}

export default OrderCard
