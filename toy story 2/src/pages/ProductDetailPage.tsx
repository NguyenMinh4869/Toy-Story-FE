import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductSection from '../components/ProductSection'
import type { ProductDTO } from '../types/ProductDTO'
import { ProductCard } from '../types/ProductCard'
import { formatPrice, formatDiscount } from '../utils/formatPrice'
import { useCart } from '../context/CartContext'
import { getProductById, getProductsByCategoryId } from '../services/productService'

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<ProductDTO | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description')
  const [relatedProducts, setRelatedProducts] = useState<ProductCard[]>([])
  const { addToCart } = useCart()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    if (!id) return
    const productId = Number(id)
    if (Number.isNaN(productId)) {
      setError('Mã sản phẩm không hợp lệ')
      setIsLoading(false)
      return
    }
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getProductById(productId)
        const mapped: ProductDTO = {
          ...data,
          id: String(data.productId ?? id),
          images: data.imageUrl ? [data.imageUrl] : [],
        }
        setProduct(mapped)

        // Fetch related products
        if (data.categoryId) {
          const related = await getProductsByCategoryId(data.categoryId)
          const formattedRelated: ProductCard[] = related
            .filter(p => p.productId !== productId)
            .map(p => {
              const prod = p as any; // Cast safely for FE-only fields
              return {
                id: String(p.productId),
                image: p.imageUrl ?? '',
                name: p.name ?? 'Sản phẩm mới',
                price: formatPrice(p.price ?? 0),
                originalPrice: prod.originalPrice != null ? formatPrice(prod.originalPrice) : formatPrice(p.price ?? 0),
                discount: prod.discount != null ? formatDiscount(prod.discount) : '-',
              };
            })
          setRelatedProducts(formattedRelated)
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau.')
        setProduct(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  // Placeholder removed, now using state

  const handleQuantityChange = (change: number): void => {
    setQuantity(prev => Math.max(1, prev + change))
  }

  const handleAddToCart = (): void => {
    if (product) addToCart(product, quantity)
  }

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center py-20">
        <p className="font-red-hat text-[15px] text-[#484848]">Đang tải chi tiết sản phẩm...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center py-20 px-5">
        <p className="font-red-hat text-[15px] text-red-600 mb-4">{error ?? 'Sản phẩm không tồn tại.'}</p>
        <Link to="/products" className="font-tilt-warp text-[15px] text-[#1500b1] underline">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    )
  }

  const imageSources = (product.images?.length ? product.images : [product.imageUrl].filter(Boolean)) as string[]
  const hasStoreInfo = product.storeName ?? product.storeAddress ?? product.storePhone

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[#f2f2f2] border-[0.2px] border-black py-3.5 px-[58px] font-rowdies text-[10px] text-[#484848] max-md:px-5 max-md:text-[8px]">
        <Link to="/" className="text-[#484848] hover:text-black">Trang chủ</Link>
        <span> {'>'} </span>
        <span className="text-black">{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="max-w-[1800px] mx-auto py-9 px-5 grid grid-cols-[524px_1fr] gap-10 max-xl:grid-cols-1 max-xl:max-w-[600px] max-md:p-5 max-md:gap-5">
        {/* Image Gallery */}
        <div className="relative max-xl:w-full">
          <div className="w-[524px] h-[524px] rounded-xl overflow-hidden mb-5 max-xl:w-full max-xl:h-auto max-xl:aspect-square bg-[#f2f2f2] flex items-center justify-center">
            {imageSources.length > 0 ? (
              <img
                src={imageSources[selectedImageIndex] ?? imageSources[0]}
                alt={product.name ?? ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-red-hat text-[15px] text-[#888]">Chưa có ảnh</span>
            )}
          </div>
          {imageSources.length > 1 && (
            <div className="flex gap-2.5 items-center justify-center relative">
              <button className="bg-none border-none cursor-pointer p-2 text-[#333] transition-colors hover:text-[#ca002a]" aria-label="Previous image">
                <ChevronLeft size={24} stroke="currentColor" strokeWidth={2} />
              </button>
              {imageSources.map((img, index) => (
                <div
                  key={index}
                  className={`w-[120px] h-[120px] rounded-lg overflow-hidden cursor-pointer transition-opacity opacity-50 hover:opacity-100 ${selectedImageIndex === index ? 'opacity-100' : ''} max-md:w-20 max-md:h-20 max-[480px]:w-[60px] max-[480px]:h-[60px]`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={img} alt={`${product.name} - view ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
              <button className="bg-none border-none cursor-pointer p-2 text-[#333] transition-colors hover:text-[#ca002a]" aria-label="Next image">
                <ChevronRight size={24} stroke="currentColor" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-5">
          <h1 className="font-rowdies text-xl leading-[1.4] text-black m-0 max-md:text-base max-[480px]:text-sm">{product.name}</h1>

          <div className="flex items-center gap-[15px] text-[15px] flex-wrap max-md:text-[13px]">
            <span className="font-red-hat text-[#454040]">Thương hiệu</span>
            <span className="font-rowdies text-[#1500b1]">{product.brandName ?? '-'}</span>
            {product.sku != null && (
              <>
                <span className="font-red-hat text-[#454040]">SKU</span>
                <span className="font-rowdies text-black">{product.sku}</span>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-red-hat text-xl text-[#454040]">Giá Bán:</span>
            <div className="flex items-center gap-5">
              <span className="font-red-hat text-[22px] text-red-600 font-semibold max-md:text-lg">{formatPrice(product.price ?? 0)}</span>
              {product.originalPrice != null && (
                <span className="font-red-hat text-lg text-black line-through max-md:text-sm">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>

          <div className="font-red-hat text-[15px] text-black leading-[1.6] max-[480px]:text-xs">
            <p className="m-[5px_0]">Đã bao gồm VAT và các khoản thuế/phí theo quy định</p>
            <p className="m-[5px_0]">(Chưa bao gồm phí vận chuyển)</p>
            <ul className="m-2.5_0 pl-5">
              <li className="m-[5px_0]">Miễn phí vận chuyển tiêu chuẩn cho đơn hàng từ 500.000 ₫.</li>
              <li className="m-[5px_0]">Phí vận chuyển hỏa tốc áp dụng cho tất cả đơn hàng.</li>
              <li className="m-[5px_0]">Giao hàng hỏa tốc 4 tiếng. <a href="#" className="text-[#1500b1] underline">Xem chi tiết</a></li>
              <li className="m-[5px_0]">Hỗ trợ trả góp đơn hàng từ 3 triệu. <a href="#" className="text-[#1500b1] underline">Xem chi tiết</a></li>
            </ul>
          </div>

          {/* Quantity Selector and Add to Cart */}
          <div className="flex flex-col gap-2.5">
            <div className="font-tilt-warp text-[15px] text-black">Số lượng</div>
            <div className="flex gap-[15px] items-center max-md:flex-col max-md:w-full">
              <div className="bg-[#f2f2f2] rounded-lg flex items-center w-[199px] h-10 justify-between px-[13px] max-md:w-full">
                <button
                  className="bg-none border-none font-tilt-warp text-[15px] cursor-pointer py-[5px] px-2.5 text-black"
                  onClick={() => handleQuantityChange(-1)}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="font-tilt-warp text-[15px] text-black min-w-[30px] text-center">{quantity}</span>
                <button
                  className="bg-none border-none font-tilt-warp text-[15px] cursor-pointer py-[5px] px-2.5 text-black"
                  onClick={() => handleQuantityChange(1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button className="bg-[#ca002a] border-none rounded-lg h-10 px-5 font-tilt-warp text-[15px] text-white cursor-pointer transition-colors hover:bg-[#ab0007] whitespace-nowrap max-md:w-full" onClick={handleAddToCart}>
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>

          {/* Store Availability - only when API provides store info */}
          {hasStoreInfo && (
            <div className="border border-[#d9d9d9] p-5 rounded-lg">
              <h3 className="font-tilt-warp text-[15px] text-black m-0 mb-[15px]">Dự kiến các cửa hàng còn sản phẩm</h3>
              <div>
                {product.storeName != null && (
                  <p className="font-tilt-warp text-sm text-black m-2 leading-[1.5]">
                    <strong>{product.storeName}</strong>
                    {product.stock != null && <> - <span className="text-red-600 font-bold">{product.stock}</span> có sẵn</>}
                  </p>
                )}
                {product.storeAddress != null && <p className="font-red-hat text-sm m-2 leading-[1.5]">{product.storeAddress}</p>}
                {product.storePhone != null && <p className="font-red-hat text-sm m-2 leading-[1.5]">{product.storePhone}</p>}
              </div>
            </div>
          )}

          {/* Product Specifications */}
          <div className="border border-[#d9d9d9] p-5 rounded-lg">
            <h3 className="font-tilt-warp text-[15px] text-black m-0 mb-[15px]">Thông tin sản phẩm</h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-[#d9d9d9]">
                  <td className="py-3 font-red-hat text-[15px] text-black w-[40%] max-[480px]:text-xs max-[480px]:py-2">Chủ đề</td>
                  <td className="py-3 font-red-hat text-[15px] text-black font-medium max-[480px]:text-xs max-[480px]:py-2">{product.categoryName ?? '-'}</td>
                </tr>
                {product.sku != null && (
                  <tr className="border-b border-[#d9d9d9]">
                    <td className="py-3 font-red-hat text-[15px] text-black w-[40%] max-[480px]:text-xs max-[480px]:py-2">Mã sản phẩm</td>
                    <td className="py-3 font-red-hat text-[15px] text-black font-medium max-[480px]:text-xs max-[480px]:py-2">{product.sku}</td>
                  </tr>
                )}
                <tr className="border-b border-[#d9d9d9]">
                  <td className="py-3 font-red-hat text-[15px] text-black w-[40%] max-[480px]:text-xs max-[480px]:py-2">Tuổi</td>
                  <td className="py-3 font-red-hat text-[15px] text-black font-medium max-[480px]:text-xs max-[480px]:py-2">{product.ageRange ?? '-'}</td>
                </tr>
                <tr className="border-b border-[#d9d9d9]">
                  <td className="py-3 font-red-hat text-[15px] text-black w-[40%] max-[480px]:text-xs max-[480px]:py-2">Thương hiệu</td>
                  <td className="py-3 font-red-hat text-[15px] text-black font-medium max-[480px]:text-xs max-[480px]:py-2">{product.brandName ?? '-'}</td>
                </tr>
                <tr className="border-b border-[#d9d9d9]">
                  <td className="py-3 font-red-hat text-[15px] text-black w-[40%] max-[480px]:text-xs max-[480px]:py-2">Xuất xứ thương hiệu</td>
                  <td className="py-3 font-red-hat text-[15px] text-black font-medium max-[480px]:text-xs max-[480px]:py-2">{product.origin ?? '-'}</td>
                </tr>
                <tr className="border-b border-[#d9d9d9]">
                  <td className="py-3 font-red-hat text-[15px] text-black w-[40%] max-[480px]:text-xs max-[480px]:py-2">Giới tính</td>
                  <td className="py-3 font-red-hat text-[15px] text-black font-medium max-[480px]:text-xs max-[480px]:py-2">{product.gender ?? '-'}</td>
                </tr>
                <tr className="border-b border-[#d9d9d9]">
                  <td className="py-3 font-red-hat text-[15px] text-black w-[40%] max-[480px]:text-xs max-[480px]:py-2">Chất liệu</td>
                  <td className="py-3 font-red-hat text-[15px] text-black font-medium max-[480px]:text-xs max-[480px]:py-2">{product.material ?? '-'}</td>
                </tr>
                {product.manufacturer != null && (
                  <tr className="border-b border-[#d9d9d9]">
                    <td className="py-3 font-red-hat text-[15px] text-black w-[40%] max-[480px]:text-xs max-[480px]:py-2">Nơi sản xuất</td>
                    <td className="py-3 font-red-hat text-[15px] text-black font-medium max-[480px]:text-xs max-[480px]:py-2">{product.manufacturer}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <div className="max-w-[1800px] mx-auto my-16 px-5 lg:px-[111px]">
        <div className="flex border-b border-[#eee] mb-10 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-4 px-8 font-tilt-warp text-lg transition-all relative ${activeTab === 'description' ? 'text-[#ca002a]' : 'text-[#888] hover:text-[#333]'}`}
          >
            Mô tả sản phẩm
            {activeTab === 'description' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ca002a] rounded-t-full shadow-[0_-2px_8px_rgba(202,0,42,0.3)]" />}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 px-8 font-tilt-warp text-lg transition-all relative ${activeTab === 'reviews' ? 'text-[#ca002a]' : 'text-[#888] hover:text-[#333]'}`}
          >
            Đánh giá sản phẩm
            {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ca002a] rounded-t-full shadow-[0_-2px_8px_rgba(202,0,42,0.3)]" />}
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-4 px-8 font-tilt-warp text-lg transition-all relative ${activeTab === 'shipping' ? 'text-[#ca002a]' : 'text-[#888] hover:text-[#333]'}`}
          >
            Chính sách vận chuyển
            {activeTab === 'shipping' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ca002a] rounded-t-full shadow-[0_-2px_8px_rgba(202,0,42,0.3)]" />}
          </button>
        </div>

        <div className="min-h-[300px]">
          {activeTab === 'description' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="font-red-hat text-base text-[#444] leading-[1.8] max-w-[1000px]">
                {(product.description || '').split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 last:mb-0">{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12">
                {/* Rating Summary */}
                <div className="space-y-8">
                  <div className="bg-[#fcf8f8] border border-[#f5ecec] rounded-2xl p-8 text-center shadow-sm">
                    <div className="font-tilt-warp text-5xl text-black mb-2">5.0<span className="text-xl text-[#888]">/5</span></div>
                    <div className="flex justify-center gap-1.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-2xl text-[#ffd900]">★</span>
                      ))}
                    </div>
                    <p className="font-red-hat text-sm text-[#888]">Dựa trên 1 đánh giá</p>
                  </div>

                  {/* Star Progress Bars */}
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-4">
                        <span className="font-red-hat text-sm text-[#444] min-w-[30px]">{star} ★</span>
                        <div className="flex-1 h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#ffd900]"
                            style={{ width: star === 5 ? '100%' : '0%' }}
                          />
                        </div>
                        <span className="font-red-hat text-sm text-[#888] min-w-[30px]">{star === 5 ? '100%' : '0%'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                  {/* Single Review Card */}
                  <div className="bg-white border border-[#eee] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ca002a] to-[#ff4d4d] flex items-center justify-center font-rowdies text-lg text-white shadow-inner">
                          M
                        </div>
                        <div>
                          <h4 className="font-tilt-warp text-base text-black mb-1">Minh Nguyen</h4>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-sm text-[#ffd900]">★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="font-red-hat text-sm text-[#888]">01/08/2026</span>
                    </div>
                    <p className="font-red-hat text-[#444] leading-relaxed pl-16 max-md:pl-0">
                      Sản phẩm robot rất thông minh, bé nhà mình rất thích các hiệu ứng đèn và nhạc. Giao hàng nhanh và đóng gói rất cẩn thận!
                    </p>
                  </div>

                  {/* Review CTA */}
                  <div className="bg-[#f9f9f9] border border-dashed border-[#ccc] rounded-2xl p-8 text-center">
                    <p className="font-tilt-warp text-base text-black mb-2">Thêm đánh giá của bạn</p>
                    <p className="font-red-hat text-sm text-[#666] max-w-[400px] mx-auto mb-4">
                      Hãy chia sẻ cảm nhận của bạn về sản phẩm này để giúp những khách hàng khác có lựa chọn tốt hơn.
                    </p>
                    <div className="inline-block px-6 py-2 bg-[#eee] rounded-full font-red-hat text-xs text-[#888]">
                      Bạn cần đăng nhập và đã mua hàng để gửi đánh giá
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-full space-y-6">
                {/* Vận chuyển hỏa tốc */}
                <div className="bg-white p-8 rounded-2xl border-l-[6px] border-[#ab0007] shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex items-start gap-6 group hover:shadow-[0_8px_30px_rgba(171,0,7,0.1)] transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-[#ab0007]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-[#ab0007]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-tilt-warp text-xl text-[#ab0007] mb-2">Vận chuyển hỏa tốc 4H</h4>
                    <p className="font-red-hat text-base text-[#444] leading-relaxed">
                      Áp dụng cho các khu vực nội thành. Cam kết giao hàng trong vòng 4 tiếng kể từ khi xác nhận đơn hàng thành công qua điện thoại hoặc tin nhắn.
                    </p>
                  </div>
                </div>

                {/* Vận chuyển tiêu chuẩn */}
                <div className="bg-white p-8 rounded-2xl border-l-[6px] border-[#ab0007] shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex items-start gap-6 group hover:shadow-[0_8px_30px_rgba(171,0,7,0.1)] transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-[#ab0007]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-[#ab0007]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-tilt-warp text-xl text-[#ab0007] mb-2">Vận chuyển tiêu chuẩn toàn quốc</h4>
                    <p className="font-red-hat text-base text-[#444] leading-relaxed">
                      Miễn phí vận chuyển cho tất cả đơn hàng từ 500.000 ₫. Thời gian nhận hàng từ 2-4 ngày làm việc tùy vào vị trí địa lý của quý khách.
                    </p>
                  </div>
                </div>

                {/* Chính sách trả hàng */}
                <div className="bg-white p-8 rounded-2xl border-l-[6px] border-[#ab0007] shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex items-start gap-6 group hover:shadow-[0_8px_30px_rgba(171,0,7,0.1)] transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-[#ab0007]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-[#ab0007]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-tilt-warp text-xl text-[#ab0007] mb-2">Chính sách đổi trả dễ dàng</h4>
                    <p className="font-red-hat text-base text-[#444] leading-relaxed mb-4">
                      Toy Story hỗ trợ đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng với những quy định linh hoạt bảo vệ quyền lợi người mua:
                    </p>
                    <ul className="list-none p-0 space-y-3 font-red-hat text-base text-[#444]">
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#ab0007]" />
                        Sản phẩm còn nguyên bao bì, chưa qua sử dụng hoặc lắp ráp.
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#ab0007]" />
                        Có hóa đơn mua hàng hoặc bằng chứng giao dịch hợp lệ từ website.
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#ab0007]" />
                        Hỗ trợ đổi trả miễn phí nếu sản phẩm gặp lỗi từ nhà sản xuất.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="bg-[#fcf8f8] py-1">
        <ProductSection
          title="Sản phẩm liên quan"
          products={relatedProducts}
          isDark={true}
        />
      </div>
    </div>
  )
}

export default ProductDetail
