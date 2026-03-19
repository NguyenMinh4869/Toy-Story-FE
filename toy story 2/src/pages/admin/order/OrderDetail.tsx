import React, { useState } from 'react'
import { X } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'
import { OrderDetailDto } from '@/types/OrderDTO'
import { getWarehouses } from '@/services/warehouseService'
import { assignWarehouse } from '@/services/orderService'
import { WarehouseSummaryDto } from '@/types/WarehouseDTO'
interface OrderDetailProps {
  order: OrderDetailDto | null
  onClose: () => void
  onRefresh?: () => void
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, onClose, onRefresh }) => {
  const [warehouses, setWarehouses] = useState<WarehouseSummaryDto[]>([])
  const [loadingWarehouses, setLoadingWarehouses] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null)

  if (!order) return null

  const handleFetchWarehouses = async () => {
    setLoadingWarehouses(true)
    try {
      const data = await getWarehouses()
      setWarehouses(data)
    } finally {
      setLoadingWarehouses(false)
    }
  }

  const handleAssign = async () => {
    if (!selectedWarehouse) return
    await assignWarehouse(order.orderId, selectedWarehouse)
    if (onRefresh) {
      onRefresh()
    }
    onClose()
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

        {/* Show assign button if warehouseId is null */}
        {order.warehouseId == null && (
          <div className="mb-4">
            {warehouses.length === 0 ? (
              <button
                onClick={handleFetchWarehouses}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {loadingWarehouses ? 'Đang tải...' : 'Gán kho'}
              </button>
            ) : (
              <div className="space-y-2">
                <select
                  value={selectedWarehouse ?? ''}
                  onChange={(e) => setSelectedWarehouse(Number(e.target.value))}
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="">-- Chọn kho --</option>
                  {warehouses.map(w => (
                    <option key={w.warehouseId} value={w.warehouseId}>
                      {w.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={!selectedWarehouse}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Xác nhận gán kho
                </button>
              </div>
            )}
          </div>
        )}
        <h3 className="font-semibold mb-2">Sản phẩm</h3>
        <div className="space-y-3">
          {order.items && order.items.length > 0 ? (
            order.items.map(item => (
              <div key={item.orderItemId} className="flex items-center gap-4 border-b pb-2">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 rounded-lg object-cover" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-500">
                    SL: {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <p className="font-bold text-red-600">{formatPrice(item.totalPrice)}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Không có sản phẩm nào</p>
          )}
        </div>

        {order.invoice && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Hóa đơn</h3>
            <p>Mã hóa đơn: #{order.invoice.invoiceId}</p>
            <p>Ngày xuất: {new Date(order.invoice.issuedAt).toLocaleString('vi-VN')}</p>
            <p>Số tiền: {formatPrice(order.invoice.amountDue)}</p>
            <p>Trạng thái: {order.invoice.status}</p>
          </div>
        )}

        <div className="mt-6 text-right">
          <p className="text-lg font-bold text-red-600">
            Tổng cộng: {formatPrice(order.totalAmount)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
