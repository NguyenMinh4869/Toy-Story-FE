/**
 * Wishlist Page
 * Placeholder for wishlist feature
 */

import React from 'react'
import ProfileLayout from '../layouts/ProfileLayout'
import { Heart, ShoppingCart } from 'lucide-react'

const WishlistPage: React.FC = () => {
  return (
    <ProfileLayout>
      <div>
        <h2 className="text-[#00247d] text-2xl font-bold mb-6 font-tilt-warp">
          Danh Sách Yêu Thích
        </h2>

        {/* Empty State */}
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <Heart size={48} className="text-[#ab0007]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Danh sách yêu thích trống
          </h3>
          <p className="text-gray-500 mb-6">
            Lưu các sản phẩm yêu thích để mua sau
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#ab0007] text-white rounded-lg font-medium hover:bg-[#8a0006] transition-colors no-underline"
          >
            <ShoppingCart size={20} />
            Tiếp tục mua sắm
          </a>
        </div>

        {/* Feature Info */}
        <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
          <div className="flex gap-4">
            <Heart size={24} className="text-[#ab0007] flex-shrink-0" />
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Cách sử dụng danh sách yêu thích
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Nhấn icon trái tim trên sản phẩm để thêm vào danh sách</li>
                <li>• Theo dõi giá và tình trạng còn hàng</li>
                <li>• Nhận thông báo khi sản phẩm giảm giá</li>
                <li>• Chia sẻ danh sách với bạn bè</li>
              </ul>
              <p className="text-sm text-gray-500 mt-3 italic">
                Tính năng đang được phát triển và sẽ sớm ra mắt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProfileLayout>
  )
}

export default WishlistPage
