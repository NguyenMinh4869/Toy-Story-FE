import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductSection from '../components/ProductSection'
import type { ProductDTO } from '../types/ProductDTO'
import { ProductCard } from '../types/ProductCard'
import { formatPrice, formatDiscount } from '../utils/formatPrice'
import { useCart } from '../context/CartContext'
import { getProductById } from '../services/productService'

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<ProductDTO | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const { addToCart } = useCart()

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

  // Related products from current product (single item placeholder when no API)
  const relatedProducts: ProductCard[] = product
    ? [
        {
          image: product.imageUrl ?? undefined,
          name: product.name ?? '',
          price: formatPrice(product.price),
          originalPrice: product.originalPrice != null ? formatPrice(product.originalPrice) : formatPrice(product.price),
          discount: product.discount != null ? formatDiscount(product.discount) : '-',
        },
      ]
    : []

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
              <span className="font-red-hat text-[22px] text-red-600 font-semibold max-md:text-lg">{formatPrice(product.price)}</span>
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

      {/* Product Description */}
      <div className="max-w-[1800px] mx-auto my-10 px-5">
        <h2 className="font-tilt-warp text-[15px] text-black mb-5">Mô tả sản phẩm</h2>
        <div className="font-red-hat text-[13px] text-black leading-[1.8] max-[480px]:text-xs">
          {(product.description || '').split('\n').map((paragraph, index) => (
            <p key={index} className="m-2.5_0">{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-[1800px] mx-auto my-10 px-5">
        <h2 className="font-tilt-warp text-[13px] text-black mb-5">Đánh giá sản phẩm</h2>
        <div className="flex items-center gap-5 mb-[30px]">
          <div className="font-tilt-warp text-2xl text-black">5.0/5</div>
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-xl text-[#ffd900]">★</span>
            ))}
          </div>
        </div>
        <div className="border border-[#f0f0f0] rounded-[17px] p-5 mb-5">
          <div className="relative">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center font-red-hat text-[8px] text-black">C</div>
              <span className="font-tilt-warp text-[8px] text-black">Minh Nguyen</span>
            </div>
            <div className="flex gap-[3px] mb-2.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-xs text-[#ffd900]">★</span>
              ))}
            </div>
            <p className="font-red-hat text-[8px] text-black m-2.5_0">Ngon</p>
            <span className="font-red-hat text-[8px] text-black absolute right-0 top-8">01/08/2026</span>
          </div>
        </div>
        <div className="border border-[#f0f0f0] rounded-[17px] p-5 text-center">
          <p className="font-red-hat text-[8px] text-black m-[5px_0]">Nhấn để đánh giá</p>
          <p className="text-[8px] text-[#666] m-[5px_0]">Chỉ khách hàng đã mua hàng mới được đánh giá</p>
        </div>
      </div>

      {/* Related Products */}
      <ProductSection 
        title="Sản phẩm liên quan"
        products={relatedProducts}
      />
    </div>
  )
}

export default ProductDetail
