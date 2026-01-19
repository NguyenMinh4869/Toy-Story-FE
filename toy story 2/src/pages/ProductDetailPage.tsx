import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductSection from '../components/ProductSection'
import type { ViewProductDto } from '../types/ProductDTO'
import { ProductCard } from '../types/ProductCard'
import { formatPrice, formatDiscount } from '../utils/formatPrice'

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)

  // Mock data - structure ready for API call with useEffect
  const product: ViewProductDto = {
    id: id || '1',
    name: 'Mô Hình Đồ Chơi Xe Tập Đi Đa Năng Có Nhạc Và Đèn Cho Bé VTECH 80-505600',
    price: 1245300,
    originalPrice: 1779000,
    description: `Khám phá thế giới kỳ diệu qua từng mặt khối!
Bé sẽ hoàn toàn bị cuốn hút vào hành trình khám phá đầy màu sắc và bất ngờ với đồ chơi hình khối 6 mặt PEEK A BOO – mã PAB055. Sản phẩm là sự kết hợp hoàn hảo giữa học và chơi, giúp bé phát triển đa giác quan, khả năng vận động, nhận thức và tư duy logic ngay từ giai đoạn đầu đời.

6 mặt – 6 trải nghiệm học hỏi độc đáo
Mỗi mặt của khối đồ chơi được thiết kế như một mini-game nhỏ:
- Mặt 1 – Bánh răng xoay: Bé sẽ học cách phối hợp tay mắt và nhận biết nguyên lý vận hành.
- Mặt 2 –  Mặt trống vui nhộn-  Giúp bé làm phát triên vận động tinh, xúc giác qua việc chạm và lắng nghe âm thanh
- Mặt 3 – Cửa sổ lật mở và đàn piano: Rèn luyện kỹ năng điều khiển ngón tay linh hoạt, tạo cảm giác vui khi khám phá điều bất ngờ phía sau.

Lợi ích nổi bật cho bé
- Phát triển vận động tinh và sự khéo léo của bàn tay.
- Khuyến khích sự tò mò, tư duy giải quyết vấn đề.
- Tăng khả năng ghi nhớ, quan sát và phản xạ.
- Tạo nền tảng cho kỹ năng xã hội thông qua việc tự chơi hoặc chơi cùng người lớn.`,
    brandName: 'SKIBIDI TOILET',
    categoryName: 'PEEK TODDLERS TOY',
    imageUrl: 'https://www.figma.com/api/mcp/asset/ddd8d83c-d216-4677-adb5-899a3f1d6fff',
    images: [
      'https://www.figma.com/api/mcp/asset/ddd8d83c-d216-4677-adb5-899a3f1d6fff',
      'https://www.figma.com/api/mcp/asset/ddd8d83c-d216-4677-adb5-899a3f1d6fff',
      'https://www.figma.com/api/mcp/asset/ddd8d83c-d216-4677-adb5-899a3f1d6fff'
    ] as string[],
    sku: 'ST1310',
    ageRange: '6 tháng tuổi trở lên',
    origin: 'Việt Nam',
    manufacturer: 'Trung Quốc',
    gender: 'Preschool',
    stock: 24,
    storeName: '[CHA193] MYKINGDOM YÊN BÁI ĐÀ NẴNG',
    storeAddress: 'Số 21 Yên Bái Phường Hải Châu 1, Quận Hải Châu Thành phố Đà Nẵng',
    storePhone: '+842363522379',
    discount: 30
  }

  // Mock related products - convert ProductDTO to ProductCard format
  const relatedProducts: ProductCard[] = [
    {
      image: product.imageUrl,
      name: product.name,
      price: formatPrice(product.price),
      originalPrice: formatPrice(product.originalPrice),
      discount: product.discount ? formatDiscount(product.discount) : '-30%'
    },
    {
      image: product.imageUrl,
      name: product.name,
      price: formatPrice(product.price),
      originalPrice: formatPrice(product.originalPrice),
      discount: product.discount ? formatDiscount(product.discount) : '-30%'
    },
    {
      image: product.imageUrl,
      name: product.name,
      price: formatPrice(product.price),
      originalPrice: formatPrice(product.originalPrice),
      discount: product.discount ? formatDiscount(product.discount) : '-30%'
    },
    {
      image: product.imageUrl,
      name: product.name,
      price: formatPrice(product.price),
      originalPrice: formatPrice(product.originalPrice),
      discount: product.discount ? formatDiscount(product.discount) : '-30%'
    }
  ]

  // TODO: Replace with actual API call
  // useEffect(() => {
  //   fetch(`/api/products/${id}`)
  //     .then(res => res.json())
  //     .then(data => setProduct(data))
  // }, [id])

  const handleQuantityChange = (change: number): void => {
    setQuantity(prev => Math.max(1, prev + change))
  }

  const handleAddToCart = (): void => {
    console.log(`Adding ${quantity} of product ${id} to cart`)
    // TODO: Implement cart logic
  }


  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[#f2f2f2] border-[0.2px] border-black py-3.5 px-[58px] font-rowdies text-[10px] text-[#484848] max-md:px-5 max-md:text-[8px]">
        <span>Trang chủ</span>
        <span> {'>'} </span>
        <span className="text-black">{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="max-w-[1800px] mx-auto py-9 px-5 grid grid-cols-[524px_1fr] gap-10 max-xl:grid-cols-1 max-xl:max-w-[600px] max-md:p-5 max-md:gap-5">
        {/* Image Gallery */}
        <div className="relative max-xl:w-full">
          <div className="w-[524px] h-[524px] rounded-xl overflow-hidden mb-5 max-xl:w-full max-xl:h-auto max-xl:aspect-square">
            <img 
              src={(product.images || [product.imageUrl])[selectedImageIndex]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2.5 items-center justify-center relative">
            <button className="bg-none border-none cursor-pointer p-2 text-[#333] transition-colors hover:text-[#ca002a]" aria-label="Previous image">
              <ChevronLeft size={24} stroke="currentColor" strokeWidth={2} />
            </button>
            {(product.images || [product.imageUrl]).map((img, index) => (
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
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-5">
          <h1 className="font-rowdies text-xl leading-[1.4] text-black m-0 max-md:text-base max-[480px]:text-sm">{product.name}</h1>
          
          <div className="flex items-center gap-[15px] text-[15px] flex-wrap max-md:text-[13px]">
            <span className="font-red-hat text-[#454040]">Thương hiệu</span>
            <span className="font-rowdies text-[#1500b1]">{product.brandName}</span>
            <span className="font-red-hat text-[#454040]">SKU</span>
            <span className="font-rowdies text-black">{product.sku}</span>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-red-hat text-xl text-[#454040]">Giá Bán:</span>
            <div className="flex items-center gap-5">
              <span className="font-red-hat text-[22px] text-red-600 font-semibold max-md:text-lg">{formatPrice(product.price)}</span>
              <span className="font-red-hat text-lg text-black line-through max-md:text-sm">{formatPrice(product.originalPrice)}</span>
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

          {/* Store Availability */}
          <div className="border border-[#d9d9d9] p-5 rounded-lg">
            <h3 className="font-tilt-warp text-[15px] text-black m-0 mb-[15px]">Dự kiến các cửa hàng còn sản phẩm</h3>
            <div>
              <p className="font-tilt-warp text-sm text-black m-2 leading-[1.5]">
                <strong>{product.storeName}</strong> - <span className="text-red-600 font-bold">{product.stock}</span> có sẵn
              </p>
              <p className="font-red-hat text-sm m-2 leading-[1.5]">{product.storeAddress}</p>
              <p className="font-red-hat text-sm m-2 leading-[1.5]">{product.storePhone}</p>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="border border-[#d9d9d9] p-5 rounded-lg">
            <h3 className="font-tilt-warp text-[15px] text-black m-0 mb-[15px]">Thông tin sản phẩm</h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-[#d9d9d9]">
                  <td className="py-3 font-red-hat text-[15px] text-black w-[40%] max-[480px]:text-xs max-[480px]:py-2">Chủ đề</td>
                  <td className="py-3 font-red-hat text-[15px] text-black font-medium max-[480px]:text-xs max-[480px]:py-2">{product.categoryName}</td>
                </tr>
                <tr className="border-b border-[#d9d9d9]">
                  <td className="py-3 font-red-hat text-[15px] text-black w-[40%] max-[480px]:text-xs max-[480px]:py-2">Mã sản phẩm</td>
                  <td className="py-3 font-red-hat text-[15px] text-black font-medium max-[480px]:text-xs max-[480px]:py-2">{product.sku}</td>
                </tr>
                <tr className="border-b border-[#d9d9d9]">
                  <td className="py-3 font-red-hat text-[15px] text-black w-[40%] max-[480px]:text-xs max-[480px]:py-2">Tuổi</td>
                  <td className="py-3 font-red-hat text-[15px] text-black font-medium max-[480px]:text-xs max-[480px]:py-2">{product.ageRange}</td>
                </tr>
                <tr className="border-b border-[#d9d9d9]">
                  <td className="py-3 font-red-hat text-[15px] text-black w-[40%] max-[480px]:text-xs max-[480px]:py-2">Thương hiệu</td>
                  <td className="py-3 font-red-hat text-[15px] text-black font-medium max-[480px]:text-xs max-[480px]:py-2">{product.brandName}</td>
                </tr>
                <tr className="border-b border-[#d9d9d9]">
                  <td className="py-3 font-red-hat text-[15px] text-black w-[40%] max-[480px]:text-xs max-[480px]:py-2">Xuất xứ thương hiệu</td>
                  <td className="py-3 font-red-hat text-[15px] text-black font-medium max-[480px]:text-xs max-[480px]:py-2">{product.origin}</td>
                </tr>
                <tr className="border-b border-[#d9d9d9]">
                  <td className="py-3 font-red-hat text-[15px] text-black w-[40%] max-[480px]:text-xs max-[480px]:py-2">Giới tính</td>
                  <td className="py-3 font-red-hat text-[15px] text-black font-medium max-[480px]:text-xs max-[480px]:py-2">{product.gender}</td>
                </tr>
                <tr className="border-b border-[#d9d9d9]">
                  <td className="py-3 font-red-hat text-[15px] text-black w-[40%] max-[480px]:text-xs max-[480px]:py-2">Nơi sản xuất</td>
                  <td className="py-3 font-red-hat text-[15px] text-black font-medium max-[480px]:text-xs max-[480px]:py-2">{product.manufacturer}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="max-w-[1800px] mx-auto my-10 px-5">
        <h2 className="font-tilt-warp text-[15px] text-black mb-5">Mô tả sản phẩm</h2>
        <div className="font-red-hat text-[13px] text-black leading-[1.8] max-[480px]:text-xs">
          {product.description.split('\n').map((paragraph, index) => (
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
