/**
 * PromotionPage - Trang Khuyến Mãi Toy Story
 * Thiết kế cao cấp, hiện đại với hiệu ứng động
 */

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Tag, ChevronRight, Gift, Sparkles, AlertCircle } from 'lucide-react'
import { getPromotions } from '../services/promotionService'
import { filterProductsPublic } from '../services/productService'
import { BreadcrumbHeader } from '../components/BreadcrumbHeader'
import type { ViewPromotionSummaryDto } from '../types/PromotionDTO'
import type { ViewProductDto } from '../types/ProductDTO'
import { Link } from 'react-router-dom'

const PromotionCard: React.FC<{ promo: ViewPromotionSummaryDto; index: number }> = ({ promo, index }) => {
  const [products, setProducts] = useState<ViewProductDto[]>([])
  const [loadingProds, setLoadingProds] = useState(false)

  useEffect(() => {
    const fetchPromoProducts = async () => {
      if (!promo.promotionId) return
      try {
        setLoadingProds(true)
        const data = await filterProductsPublic({ promotionId: promo.promotionId })
        setProducts(data.slice(0, 4))
      } catch (err) {
        console.error('Error fetching promo products:', err)
      } finally {
        setLoadingProds(false)
      }
    }
    fetchPromoProducts()
  }, [promo.promotionId])

  const isExpired = promo.endDate ? new Date(promo.endDate) < new Date() : false

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white rounded-[40px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#f0f0f0]"
    >
      {/* Promotion Image/Banner */}
      <div className="relative h-[220px] overflow-hidden">
        <img
          src={promo.imageUrl || 'https://images.unsplash.com/photo-1545558014-868157bb5815?q=80&w=1000&auto=format&fit=crop'}
          alt={promo.name || ''}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-6 left-6 flex gap-2">
          {promo.isActive && !isExpired ? (
            <div className="bg-[#ca002a] text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-pulse">
              <Sparkles size={12} />
              ĐANG DIỄN RA
            </div>
          ) : (
            <div className="bg-gray-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <AlertCircle size={12} />
              ĐÃ KẾT THÚC
            </div>
          )}
        </div>

        {/* Floating Tag */}
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="font-tilt-warp text-2xl text-white mb-2 line-clamp-1">{promo.name}</h3>
          <div className="flex items-center gap-2 text-white/80 text-xs font-red-hat">
            <Clock size={14} className="text-[#ffd900]" />
            <span>
              {promo.startDate ? new Date(promo.startDate).toLocaleDateString('vi-VN') : '...'} -
              {promo.endDate ? new Date(promo.endDate).toLocaleDateString('vi-VN') : '...'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <p className="font-red-hat text-sm text-gray-500 leading-relaxed mb-8 h-[60px] overflow-hidden line-clamp-3">
          {promo.description}
        </p>

        {/* Product Preview (Mini Grid) */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex -space-x-3 overflow-hidden">
            {loadingProds ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-gray-100 animate-pulse" />
              ))
            ) : products.length > 0 ? (
              products.map((p) => (
                <div key={p.productId} className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-white overflow-hidden shadow-sm border border-[#f0f0f0]">
                  <img src={p.imageUrl || ''} alt="" className="w-full h-full object-contain" />
                </div>
              ))
            ) : (
              [1, 2, 3].map((i) => (
                <div key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-[#f9f9f9] flex items-center justify-center">
                  <Gift size={18} className="text-[#ca002a]/10" />
                </div>
              ))
            )}
          </div>

          <Link
            to={`/products?promotionId=${promo.promotionId}`}
            className="group/btn flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#ca002a] text-white font-tilt-warp text-xs px-6 py-3.5 rounded-2xl transition-all duration-300 transform active:scale-95"
          >
            SĂN DEAL NGAY
            <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

const PromotionPage: React.FC = () => {
  const [promotions, setPromotions] = useState<ViewPromotionSummaryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllPromotions = async () => {
      try {
        setLoading(true)
        const data = await getPromotions()
        // API response might be wrapped in { data: [...] } if standard axios mock, 
        // but promotionService's getPromotions returns response.data which is already the array
        setPromotions(data || [])
      } catch (err) {
        console.error('Error fetching promotions:', err)
        setError('Không thể kết nối đến hệ thống. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }
    fetchAllPromotions()
  }, [])

  return (
    <div className="bg-[#fcf8f8] min-h-screen">
      <BreadcrumbHeader items={[{ label: 'Chương trình khuyến mãi' }]} />

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-20 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block bg-white/50 backdrop-blur-sm border border-[#f5ecec] px-6 py-2 rounded-full mb-6 font-tilt-warp text-[#ca002a] text-sm tracking-wider"
          >
            ✨ TOY STORY SPECIAL OFFERS ✨
          </motion.div>
          <h1 className="font-tilt-warp text-5xl md:text-7xl bg-gradient-to-b from-[#1a1a1a] via-[#1a1a1a] to-[#ca002a] bg-clip-text text-transparent leading-tight mb-6">
            Khuyến Mãi <br /> Ngập Tràn 🎈
          </h1>
          <p className="font-red-hat text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Khám phá những ưu đãi hấp dẫn nhất dành cho bé yêu. Đừng bỏ lỡ cơ hội sở hữu đồ chơi chính hãng với mức giá cực kỳ ưu đãi.
          </p>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#ffd900]/10 rounded-full blur-3xl -z-10 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-[#ca002a]/5 rounded-full blur-3xl -z-10" />
        </div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-[40px] h-[450px] animate-pulse shadow-sm" />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-[40px] p-20 text-center shadow-lg border border-red-50"
            >
              <div className="w-20 h-20 bg-red-50 text-[#ca002a] rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} />
              </div>
              <h2 className="font-tilt-warp text-2xl text-black mb-4">Ối! Có lỗi xảy ra</h2>
              <p className="font-red-hat text-gray-500 mb-8">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#ca002a] text-white font-tilt-warp px-10 py-4 rounded-2xl shadow-lg hover:shadow-red-200 transition-all"
              >
                TẢI LẠI TRANG
              </button>
            </motion.div>
          ) : promotions.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-[40px] p-20 text-center shadow-lg border border-[#f0f0f0]"
            >
              <Gift size={80} className="text-gray-200 mx-auto mb-8" />
              <h2 className="font-tilt-warp text-2xl text-black mb-2">Hiện chưa có khuyến mãi mới</h2>
              <p className="font-red-hat text-gray-500">Chúng tôi đang cập nhật những chương trình ưu đãi mới. Vui lòng quay lại sau nhé!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {promotions.map((promo, index) => (
                <PromotionCard key={promo.promotionId} promo={promo} index={index} />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Newsletter Section */}
        <div className="mt-32 p-12 md:p-20 bg-gradient-to-br from-[#1a1a1a] to-black rounded-[60px] relative overflow-hidden text-center text-white">
          <div className="relative z-10 max-w-3xl mx-auto">
            <Tag size={48} className="text-[#ffd900] mx-auto mb-8 animate-bounce" />
            <h2 className="font-tilt-warp text-4xl md:text-5xl mb-6">Đăng ký nhận mã giảm giá</h2>
            <p className="font-red-hat text-gray-400 text-lg mb-10 leading-relaxed">
              Trở thành người đầu tiên biết về các chương trình khuyến mãi đặc biệt và nhận ngay voucher giảm giá 10% cho đơn hàng đầu tiên.
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 font-red-hat focus:outline-none focus:ring-2 focus:ring-[#ca002a] transition-all"
              />
              <button className="bg-[#ca002a] text-white font-tilt-warp px-8 py-4 rounded-2xl hover:bg-[#ab0007] transition-all shadow-lg shadow-red-900/40">
                ĐĂNG KÝ
              </button>
            </div>
          </div>

          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ca002a]/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ffd900]/10 rounded-full blur-[100px]" />
        </div>
      </main>
    </div>
  )
}

export default PromotionPage
