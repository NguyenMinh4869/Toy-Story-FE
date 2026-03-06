import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight, Heart, Image } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../types/ProductCard'

interface ProductSectionProps {
  title: string
  subtitle?: string
  products: ProductCard[]
  hasGradient?: boolean
  isDark?: boolean
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  products,
  hasGradient = false,
  isDark = false
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const target = e.currentTarget
    target.style.display = 'none'
    const nextElement = target.nextElementSibling as HTMLElement
    if (nextElement) {
      nextElement.classList.add('flex')
      nextElement.classList.remove('hidden')
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - 500 : scrollLeft + 500
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <section className={`py-20 px-[111px] mb-20 relative max-xl:px-5 max-xl:py-10 ${hasGradient ? 'bg-gradient-to-b from-[#f8e3b8] via-[#f8e3b8] to-[#e2b663] rounded-[45px] py-[100px] px-[21px] pb-20 mx-[111px] mb-20 max-xl:mx-5' : ''}`}>
      <div className="text-center mb-10">
        {subtitle && (
          <div className="mb-5 h-[53px] flex items-center justify-center">
            <div className="w-[157px] h-[53px] bg-white/20 rounded-lg"></div>
          </div>
        )}
        <h2 className={`font-tilt-warp text-5xl bg-gradient-to-b ${isDark ? 'from-[#ca002a] via-[#ca002a] to-[#ffd900]' : 'from-white via-white to-[#ffd900]'} bg-clip-text text-transparent m-0 leading-[1.2] text-center ${!hasGradient ? 'mb-[27px]' : ''}`}>{title}</h2>
        {subtitle && <p className={`font-tilt-warp text-sm ${isDark ? 'text-black' : 'text-white'} m-2.5`}>{subtitle}</p>}
        <div className="flex items-center justify-center gap-[17px] mt-[27px]">
          <div className="w-[405px] h-1 bg-[#d8c59e] border border-black/16 max-xl:w-[200px]"></div>
          <div className="w-[53.707px] h-[53.707px] rotate-[13deg]">
            <div className="w-full h-full bg-[#d8c59e] rounded-sm border border-black/16"></div>
          </div>
          <div className="w-[405px] h-1 bg-[#d8c59e] border border-black/16 max-xl:w-[200px]"></div>
        </div>
      </div>
      <div className="relative flex items-center gap-5">
        <button
          onClick={() => scroll('left')}
          className="group bg-transparent border-none cursor-pointer w-[40px] h-[40px] flex-shrink-0 z-[10] flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
          aria-label="Previous"
        >
          <ChevronLeft
            size={40}
            stroke={isDark ? "#ca002a" : "white"}
            strokeWidth={3}
            className="w-full h-full group-hover:scale-110 transition-transform"
          />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scroll-smooth flex-1 py-10 [&::-webkit-scrollbar]:hidden scrollbar-hide"
        >
          {products.map((product, index) => (
            <div key={`${product.id}-${index}`} className="relative min-w-[280px] w-[280px] h-[420px] flex-shrink-0 group/card">
              <Link to={`/product/${product.id}`} className="no-underline text-inherit block w-full h-full transition-all duration-500 hover:-translate-y-3">
                {/* Card Background & Shadow */}
                <div className="absolute inset-0 bg-white rounded-[32px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] group-hover/card:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 border border-[#f0f0f0]"></div>

                {/* Main Content Container */}
                <div className="relative z-[2] w-full h-full p-6 flex flex-col">
                  {/* Image Container */}
                  <div className="bg-[#f9f9f9] rounded-[24px] p-4 mb-5 flex items-center justify-center relative aspect-square overflow-hidden group-hover/card:bg-white transition-colors duration-500">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transform group-hover/card:scale-110 transition-transform duration-700"
                      onError={handleImageError}
                    />

                    {/* Discount Badge */}
                    {product.discount !== '-' && (
                      <div className="absolute top-3 right-3 bg-[#ca002a] text-white font-tilt-warp text-xs px-3 py-1.5 rounded-full shadow-lg z-10 animate-pulse">
                        {product.discount}
                      </div>
                    )}

                    {/* Placeholder for missing image */}
                    <div className="hidden flex-col items-center justify-center gap-2 text-[#999] text-xs [img[style*='display:_none']~&]:flex">
                      <Image size={48} stroke="#ccc" strokeWidth={1.5} />
                      <span>No image</span>
                    </div>

                    {/* Quick Action Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500 delay-[50ms]">
                        <Heart size={20} className="text-[#ca002a]" />
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-1">
                    <h3 className="font-tilt-warp text-lg text-[#1a1a1a] m-0 mb-2 leading-tight h-[54px] overflow-hidden line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="mt-auto">
                      <div className="flex items-baseline gap-3 mb-4">
                        <span className="font-tilt-warp text-xl text-[#ca002a]">
                          {product.price}
                        </span>
                        {product.originalPrice !== product.price && (
                          <span className="font-tilt-warp text-sm text-[#999] line-through decoration-[#ca002a]/30">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      <button className="w-full bg-[#1a1a1a] text-white font-tilt-warp text-sm py-3.5 rounded-2xl transition-all duration-300 hover:bg-[#ca002a] hover:shadow-[0_8px_20px_rgba(202,0,42,0.3)] flex items-center justify-center gap-2">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="group bg-transparent border-none cursor-pointer w-[40px] h-[40px] flex-shrink-0 z-[10] flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
          aria-label="Next"
        >
          <ChevronRight
            size={40}
            stroke={isDark ? "#ca002a" : "white"}
            strokeWidth={3}
            className="w-full h-full group-hover:scale-110 transition-transform"
          />
        </button>
      </div>
    </section>
  )
}

export default ProductSection
