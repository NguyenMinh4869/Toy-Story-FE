/**
 * Order History Page
 * Placeholder for order history feature
 */

import React from 'react'
import ProfileLayout from '../layouts/ProfileLayout'
import { ShoppingBag, Package } from 'lucide-react'

const OrderHistoryPage: React.FC = () => {
  return (
    <ProfileLayout>
      <div>
        <h2 className="text-[#00247d] text-2xl font-bold mb-6 font-tilt-warp">
          Lịch Sử Mua Hàng
        </h2>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ab0007]"
          />
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <Package size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Bạn chưa đặt đơn hàng nào
          </h3>
          <p className="text-gray-500 mb-6">
            Lịch sử mua hàng của bạn sẽ hiển thị tại đây
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#ab0007] text-white rounded-lg font-medium hover:bg-[#8a0006] transition-colors no-underline"
          >
            <ShoppingBag size={20} />
            Khám phá sản phẩm
          </a>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-700">
            <strong>Đang phát triển:</strong> Tính năng lịch sử mua hàng đang được hoàn thiện.
            Bạn sẽ có thể xem chi tiết đơn hàng, theo dõi vận chuyển và đánh giá sản phẩm.
          </p>
        </div>
      </div>
    </ProfileLayout>
  )
}

export default OrderHistoryPage
