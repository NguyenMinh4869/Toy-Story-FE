/**
 * PromotionPage - Khuyến mãi
 * Implements the Figma design with reusable ProductCard component
 */

import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getPromotionsCustomerFilter } from '../services/promotionService'
import { filterProducts } from '../services/productService'
import { BreadcrumbHeader } from '../components/BreadcrumbHeader'
import { ProductCard } from '../components/ProductCard'
import type { ViewPromotionDto } from '../types/PromotionDTO'
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
          <h3 className="font-sf-pro font-bold tracking-tight text-2xl text-white mb-2 line-clamp-1">{promo.name}</h3>
          <div className="flex items-center gap-2 text-white/80 text-xs font-sf-pro">
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
        <p className="font-sf-pro text-sm text-gray-500 leading-relaxed mb-8 h-[60px] overflow-hidden line-clamp-3">
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
            className="group/btn flex items-center gap-2 bg-[#ca002a] hover:bg-[#ab0007] text-white font-sf-pro font-bold tracking-wider text-xs px-6 py-3.5 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-md shadow-red-900/20"
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
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const promos = await getPromotionsCustomerFilter()
        setPromotions(promos)
        
        // Fetch products for each promotion (skip first banner)
        const productFetches = promos.slice(1).map(async (promo) => {
          try {
            const prods = await filterProducts({ promotionId: promo.promotionId as number })
            return { promoId: promo.promotionId as number, products: prods.slice(0, 4) }
          } catch {
            return { promoId: (promo.promotionId as number) || 0, products: [] }
          }
        })
        const results = await Promise.all(productFetches)
        const map: Record<number, ViewProductDto[]> = {}
        results.forEach(({ promoId, products }) => { map[promoId] = products })
        setProductsByPromo(map)
      } catch (err) {
        console.error('Error fetching promotions:', err)
        setError('Không thể tải khuyến mãi. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="w-full h-[249px] bg-gray-200 animate-pulse rounded-[17px]" />
  )

  const BannerSkeleton = () => (
    <div className="w-full h-[180px] bg-gray-200 animate-pulse rounded-[11px]" />
  )

  if (error) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <BreadcrumbHeader items={[{ label: 'Khuyến mãi' }]} />
        <div className="flex-1 flex items-center justify-center text-red-600 px-4">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <BreadcrumbHeader items={[{ label: 'Khuyến mãi' }]} />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-6">
        {/* Hero Banner */}
        {loading ? (
          <BannerSkeleton />
        ) : promotions[0] && (
          <div className="mb-12">
            <img
              src={promotions[0].imageUrl || PRODUCT_IMAGE_87}
              alt={promotions[0].name || 'Bắt Trọn Deal Hời'}
              className="w-full h-auto object-contain rounded-[11px]"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = PRODUCT_IMAGE_87
              }}
            />
          </div>
        )}

        {/* Promotion Sections */}
        {promotions.slice(1).map((promo) => {
          const products = productsByPromo[(promo.promotionId as number) || 0] || []
          
          return (
            <section key={promo.promotionId} className="mb-16">

              {/* Section Title */}
              <h2 className="font-['Rowdies',sans-serif] text-2xl md:text-[32px] text-[#1503a3] text-center mb-6">
                {promo.name}
              </h2>
              {/* Content: Left Banner + Right Product Grid */}
              <div className="relative mb-6">
                <div className="flex gap-4 md:gap-6">
                  {/* Left Navigation Arrow */}
                  <button
                    className="absolute left-[-40px] top-1/2 -translate-y-1/2 z-10 hidden xl:block"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600 hover:text-red-600" />
                  </button>

                  {/* Left: Promotional Banner */}
                  <div className="hidden md:block w-[185px] h-[249px] flex-shrink-0 rounded-[12px] overflow-hidden">
                    <img
                      src={promo.imageUrl || PRODUCT_IMAGE_87}
                      alt={promo.name || ''}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = PRODUCT_IMAGE_87
                      }}
                    />
                  </div>

                  {/* Right: 3 Product Cards */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {loading ? (
                      <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                      </>
                    ) : products.length > 0 ? (
                      products.slice(0, 3).map((product: ViewProductDto) => (
                        <ProductCard
                          key={product.productId}
                          product={product}
                          discount={30}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center text-gray-500 py-8 font-['Tilt_Warp',sans-serif]">
                        Không có sản phẩm
                      </div>
                    )}
                  </div>

                  {/* Right Navigation Arrow */}
                  <button
                    className="absolute right-[-40px] top-1/2 -translate-y-1/2 z-10 hidden xl:block"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600 hover:text-red-600" />
                  </button>
                </div>
              </div>
              
            {/* "Xem thêm" Button */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => navigate('/products')}
                  className="bg-white border border-[#af0000] text-[#b60000] px-4 py-2 rounded-[9px] 
                    font-['Tilt_Warp',sans-serif] text-[15px] hover:bg-red-50 transition-colors
                    flex items-center gap-2"
                >
                  Xem thêm
                  <svg width="7" height="7" viewBox="0 0 7 7" className="rotate-90">
                    <path d="M3.5 0L6.5 6H0.5L3.5 0Z" fill="#b60000" />
                  </svg>
                </button>
              </div>
              {/* Bottom Decorative Icon with Line */}
              <div className="flex items-center justify-center mt-8">
                <div className="flex items-center w-full max-w-[600px]">
                  <div className="flex-1 h-[4px] bg-[#e6d7d7]" />
                  <div className="relative w-[53px] h-[53px] flex-shrink-0 mx-4 transform rotate-[13deg]">
                    <img
                      src={PRODUCT_IMAGE_87}
                      alt=""
                      className="w-full h-full object-cover rounded-[3px]"
                    />
                  </div>
                  <div className="flex-1 h-[4px] bg-[#e6d7d7]" />
                </div>
              </div>
            </section>
          )
        })}

        {/* Empty State */}
        {!loading && promotions.length === 0 && (
          <div className="text-center py-16 text-gray-500 font-['Tilt_Warp',sans-serif]">
            Không có chương trình khuyến mãi nào.
          </div>
        )}
      </main>
    </div>
  )
}

export default PromotionPage
