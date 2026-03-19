import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Minus,
  Plus,
  Star
} from "lucide-react";
import type { ProductDTO } from "../types/ProductDTO";
import { formatPrice } from "../utils/formatPrice";
import { useCart } from "../context/CartContext";
import { getProductById } from "../services/productService";
import { BreadcrumbHeader } from "../components/BreadcrumbHeader";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    const productId = Number(id);
    if (Number.isNaN(productId)) {
      setError("Mã sản phẩm không hợp lệ");
      setIsLoading(false);
      return;
    }
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProductById(productId);
        const mapped: ProductDTO = {
          ...data,
          id: String(data.productId ?? id),
          images: data.imageUrl ? [data.imageUrl] : [],
        };
        setProduct(mapped);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau.");
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleQuantityChange = (change: number): void => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAddToCart = (): void => {
    if (product) addToCart(product, quantity);
  };

  if (isLoading) {
    return (
      <div className="bg-[#a70001] min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full"
        />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-[#a70001] min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white/10 backdrop-blur-lg p-10 rounded-[3rem] border border-white/20">
          <p className="font-tilt-warp text-2xl text-white mb-6">
            {error ?? "Sản phẩm không tồn tại."}
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-red-600 px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
          >
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const imageSources = (
    product.images?.length ? product.images : [product.imageUrl].filter(Boolean)
  ) as string[];

  const hasDiscount = product.originalPrice && product.originalPrice > (product.price ?? 0);
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price!) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="bg-white min-h-screen pb-20">
      <BreadcrumbHeader items={[{ label: "Sản phẩm", to: "/products" }, { label: product.name ?? "Chi tiết" }]} />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* LEFT COLUMN: Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6 lg:sticky lg:top-8"
          >
            <div className="relative aspect-square bg-gray-50 rounded-[3.5rem] overflow-hidden shadow-2xl border border-gray-100 flex items-center justify-center group/main">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  src={imageSources[selectedImageIndex] || ""}
                  alt={product.name ?? ""}
                  className="w-[85%] h-[85%] object-contain drop-shadow-2xl group-hover/main:scale-110 transition-transform duration-700"
                />
              </AnimatePresence>
              
              {hasDiscount && (
                <div className="absolute top-10 right-10 z-10">
                  <div className="bg-red-600 text-white px-5 py-2 rounded-2xl font-tilt-warp text-xl shadow-lg ring-4 ring-red-100 italic">
                    -{discountPercent}%
                  </div>
                </div>
              )}
            </div>

            {imageSources.length > 1 && (
              <div className="flex gap-4 justify-center overflow-x-auto py-4 no-scrollbar px-2">
                {imageSources.map((img, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all p-2 flex-shrink-0 bg-white",
                      selectedImageIndex === index 
                        ? "border-red-600 shadow-lg ring-4 ring-red-50" 
                        : "border-gray-100 hover:border-red-200"
                    )}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT COLUMN: Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Meta Tags */}
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                {product.categoryName || "Đồ chơi"}
              </span>
              <div className="h-1 w-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-gray-400 text-xs font-medium ml-1">(4.8/5)</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-tilt-warp text-gray-900 leading-tight mb-4 uppercase">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-8">
               <span className="text-gray-500 font-medium whitespace-nowrap">Thương hiệu:</span>
               <Link 
                to={`/brands/${product.brandId}`}
                className="bg-gray-100 hover:bg-red-600 hover:text-white px-4 py-1.5 rounded-xl transition-all font-tilt-warp text-red-600 uppercase text-sm tracking-wide"
               >
                 {product.brandName || "Toy Story"}
               </Link>
            </div>

            {/* Price Area */}
            <div className="bg-gray-50/50 rounded-[2.5rem] p-8 mb-8 border border-gray-100">
               <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-4xl font-tilt-warp text-red-600 tracking-tight">
                    {formatPrice((product.price ?? 0) * quantity)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-gray-400 line-through font-medium">
                      {formatPrice((product.originalPrice ?? 0) * quantity)}
                    </span>
                  )}
               </div>
               {hasDiscount && (
                 <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                   <ShieldCheck className="w-4 h-4" />
                   <span>Tiết kiệm: {formatPrice(((product.originalPrice ?? 0) - (product.price ?? 0)) * quantity)}</span>
                 </div>
               )}
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-2 gap-4 mb-10">
               <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                 <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                   <Truck className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs font-bold text-gray-900">Giao hỏa tốc</p>
                   <p className="text-[10px] text-gray-500">Chỉ trong 4 giờ</p>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                   <RotateCcw className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs font-bold text-gray-900">Đổi trả 7 ngày</p>
                   <p className="text-[10px] text-gray-500">Dễ dàng & Miễn phí</p>
                 </div>
               </div>
            </div>

            {/* Selection & CTA */}
            <div className="flex flex-col gap-6 mb-12">
               <div className="flex items-center justify-between px-2">
                 <span className="font-tilt-warp text-gray-900 uppercase tracking-wide">Số lượng</span>
                 <div className="flex items-center bg-gray-100 rounded-2xl p-1 shadow-inner">
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      className="p-3 hover:bg-white hover:text-red-600 rounded-xl transition-all text-gray-500"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-tilt-warp text-lg">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      className="p-3 hover:bg-white hover:text-red-600 rounded-xl transition-all text-gray-500"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                 </div>
               </div>

               <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="flex-1 bg-red-600 text-white h-16 rounded-3xl font-tilt-warp text-xl uppercase tracking-widest shadow-2xl hover:bg-black transition-colors flex items-center justify-center gap-4 group"
                  >
                    <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    Thêm vào giỏ
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="aspect-square bg-gray-100 text-gray-400 h-16 rounded-3xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                  >
                    <Heart className="w-6 h-6" />
                  </motion.button>
               </div>
            </div>

            {/* Product Meta Stats */}
            <div className="border-t border-gray-100 pt-8 flex items-center justify-around text-gray-400 text-xs font-medium">
               <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Chính hãng 100%</div>
               <div className="flex items-center gap-2"><Truck className="w-4 h-4" /> Miễn phí vận chuyển</div>
               <div className="flex items-center gap-2 border-l pl-8"><Share2 className="w-4 h-4 cursor-pointer hover:text-red-600" /> Chia sẻ</div>
            </div>

          </motion.div>
        </div>

        {/* DETAILS SECTION */}
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          <div className="lg:col-span-1">
             <div className="sticky top-8">
               <div className="flex items-center gap-3 mb-8">
                  <div className="h-6 w-1.5 bg-red-600 rounded-full" />
                  <h2 className="text-2xl font-tilt-warp text-gray-900 uppercase">Thông số kỹ thuật</h2>
               </div>
               <div className="space-y-4">
                  {[
                    { label: "Mã sản phẩm", value: product.sku },
                    { label: "Độ tuổi", value: product.ageRange },
                    { label: "Giới tính", value: product.gender },
                    { label: "Xuất xứ", value: product.origin },
                    { label: "Chất liệu", value: product.material },
                    { label: "Chủ đề", value: product.categoryName },
                  ].map((item, idx) => item.value && (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-50">
                       <span className="text-gray-400 font-medium text-sm">{item.label}</span>
                       <span className="text-gray-800 font-bold text-sm text-right">{item.value}</span>
                    </div>
                  ))}
               </div>
             </div>
          </div>

          <div className="lg:col-span-2">
             <div className="flex items-center gap-3 mb-8">
                <div className="h-6 w-1.5 bg-red-600 rounded-full" />
                <h2 className="text-2xl font-tilt-warp text-gray-900 uppercase">Mô tả sản phẩm</h2>
             </div>
             <div className="prose prose-red max-w-none text-gray-600 leading-relaxed font-medium">
                {(product.description || "Đang cập nhật mô tả cho sản phẩm này...").split("\n").map((p, i) => (
                  <p key={i} className="mb-6 last:mb-0">{p}</p>
                ))}
             </div>

             {/* Description Graphic Placeholder */}
             <div className="mt-12 w-full aspect-[21/9] bg-gradient-to-br from-red-50 to-orange-50 rounded-[3rem] border border-red-100 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#a70001_0%,transparent_50%)]" />
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 flex flex-col items-center gap-4"
                >
                   <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center p-4">
                      <img src={imageSources[0]} alt="brand-deco" className="w-full h-full object-contain" />
                   </div>
                   <p className="font-tilt-warp text-red-600/50 uppercase text-xs tracking-[0.2em]">Toy Story Quality Assurance</p>
                </motion.div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
