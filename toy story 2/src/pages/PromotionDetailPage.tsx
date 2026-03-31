import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPromotionsCustomerFilter } from "../services/promotionService";
import { filterProducts, getProductById } from "../services/productService";
import { BreadcrumbHeader } from "../components/BreadcrumbHeader";
import { ProductCard } from "../components/ProductCard";
import type { ViewPromotionDto } from "../types/PromotionDTO";
import type { ProductDTO } from "../types/ProductDTO";
import { motion } from "framer-motion";
import {
  Gift,
  Tag,
  Calendar,
  ArrowLeft,
  Percent,
  ShoppingBag,
  Clock,
  Layers,
} from "lucide-react";
import { formatPrice } from "../utils/formatPrice";

const PromotionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState<ViewPromotionDto | null>(null);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const promoId = Number(id);
    if (Number.isNaN(promoId)) {
      setError("Mã khuyến mãi không hợp lệ");
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const allPromos = await getPromotionsCustomerFilter();
        const promo = allPromos.find((p) => p.promotionId === promoId) ?? null;
        if (!promo) {
          setError("Không tìm thấy khuyến mãi.");
          setLoading(false);
          return;
        }
        setPromotion(promo);

        // Fetch products for this promotion
        let productList: ProductDTO[] = [];
        try {
          if (promo.productId) {
            const p = await getProductById(promo.productId);
            if (p) productList = [p];
          } else {
            const filter: Record<string, number> = {};
            if (promo.categoryId) filter.categoryId = promo.categoryId;
            if (promo.brandId) filter.brandId = promo.brandId;
            productList = await filterProducts(Object.keys(filter).length > 0 ? filter : {});
          }
        } catch {
          productList = [];
        }

        // Enrich products with promotion discount
        const discount = promo.discountType === 0 ? (promo.discountValue ?? 0) : 0;
        const enriched: ProductDTO[] = productList.map((p) => {
          const originalPrice = p.price ?? 0;
          const finalPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;
          return {
            ...p,
            hasPromotion: discount > 0,
            promotionName: promo.name ?? undefined,
            finalPrice,
            originalPrice,
          };
        });
        setProducts(enriched);
      } catch {
        setError("Không thể tải thông tin khuyến mãi. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getScopeLabel = (promo: ViewPromotionDto) => {
    if (promo.productId) return "Sản phẩm cụ thể";
    if (promo.categoryId) return "Theo danh mục";
    if (promo.brandId) return "Theo thương hiệu";
    return "Toàn bộ sản phẩm";
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-14 h-14 border-4 border-red-200 border-t-red-600 rounded-full"
        />
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col">
        <BreadcrumbHeader items={[{ label: "Khuyến mãi", to: "/promotion" }, { label: "Không tìm thấy" }]} />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="bg-red-50 p-6 rounded-full mb-4">
            <Gift className="w-12 h-12 text-red-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">{error ?? "Không tìm thấy khuyến mãi"}</h2>
          <button
            onClick={() => navigate("/promotion")}
            className="mt-4 px-6 py-3 bg-[#a70001] text-white rounded-xl font-bold hover:bg-black transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const discountValue = promotion.discountType === 0 ? (promotion.discountValue ?? 0) : 0;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <BreadcrumbHeader
        items={[
          { label: "Khuyến mãi", to: "/promotion" },
          { label: promotion.name ?? "Chi tiết" },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Back button */}
        <button
          onClick={() => navigate("/promotion")}
          className="flex items-center gap-2 text-gray-500 hover:text-[#a70001] font-medium mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại khuyến mãi
        </button>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100 aspect-square lg:aspect-[4/3]"
          >
            {promotion.imageUrl ? (
              <img
                src={promotion.imageUrl}
                alt={promotion.name || ""}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                <Gift className="w-24 h-24 text-red-200" />
              </div>
            )}
            {/* Big discount badge */}
            {discountValue > 0 && (
              <div className="absolute top-6 right-6 bg-[#a70001] text-white font-['Tilt_Warp',sans-serif] text-3xl px-6 py-3 rounded-3xl shadow-2xl ring-4 ring-red-100 italic">
                -{discountValue}%
              </div>
            )}
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col"
          >
            {/* Scope badge */}
            <div className="inline-flex w-fit items-center gap-2 bg-red-50 border border-red-100 px-4 py-1.5 rounded-full mb-4">
              <Layers className="w-3.5 h-3.5 text-red-500" />
              <span className="text-red-600 text-xs font-bold uppercase tracking-wider">
                {getScopeLabel(promotion)}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-['Tilt_Warp',sans-serif] text-gray-900 leading-tight mb-4">
              {promotion.name}
            </h1>

            {promotion.description && (
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {promotion.description}
              </p>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {discountValue > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-red-500 mb-2">
                    <Percent className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Giảm giá</span>
                  </div>
                  <p className="text-3xl font-['Tilt_Warp',sans-serif] text-[#a70001]">
                    {discountValue}%
                  </p>
                </div>
              )}
              {promotion.minimumAmount && (
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-5 h-5 text-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Đơn tối thiểu</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">
                    {formatPrice(promotion.minimumAmount)}
                  </p>
                </div>
              )}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Bắt đầu</span>
                </div>
                <p className="text-base font-bold text-gray-800">{formatDate(promotion.startDate)}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Kết thúc</span>
                </div>
                <p className="text-base font-bold text-gray-800">{formatDate(promotion.endDate)}</p>
              </div>
            </div>

            {/* CTA */}
            <a
              href="/products"
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#a70001] text-white rounded-2xl font-bold text-lg hover:bg-black transition-colors duration-300 shadow-xl"
            >
              <ShoppingBag className="w-5 h-5" />
              Mua sắm ngay
            </a>
          </motion.div>
        </div>

        {/* Products Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1.5 bg-[#a70001] rounded-full" />
            <h2 className="text-2xl font-['Tilt_Warp',sans-serif] text-gray-900 uppercase">
              Sản phẩm áp dụng
              {products.length > 0 && (
                <span className="ml-2 text-base font-medium text-gray-400 normal-case">
                  ({products.length} sản phẩm)
                </span>
              )}
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-[2rem] py-20 flex flex-col items-center justify-center gap-4 shadow-sm">
              <ShoppingBag className="w-14 h-14 text-gray-200" />
              <p className="text-gray-400 font-medium text-lg">Sản phẩm đang được cập nhật...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {products.map((product, idx) => (
                <motion.div
                  key={product.productId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                >
                  <ProductCard
                    product={product}
                    discount={discountValue}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PromotionDetailPage;
