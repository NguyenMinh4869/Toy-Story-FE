import React from 'react'
import { ViewOrderDto } from '@/types/OrderDTO'
import OrderCard from './OrderCard'

interface OrderListProps {
  orders: ViewOrderDto[]
  onSelect: (orderId: number) => void
  
}

const OrderList: React.FC<OrderListProps> = ({ orders, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {orders.map(order => (
        <OrderCard
          key={order.orderId}
          order={order}
          onClick={() => onSelect(order.orderId)}
        />
      ))}
    </div>
  )
}

export default OrderList
