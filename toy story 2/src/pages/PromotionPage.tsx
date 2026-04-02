import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPromotionsCustomerFilter } from "../services/promotionService";
import { getActiveBrands } from "../services/brandService";
import { getCategories } from "../services/categoryService";
import { BreadcrumbHeader } from "../components/BreadcrumbHeader";
import type { ViewPromotionDto } from "../types/PromotionDTO";
import type { ViewBrandDto } from "../types/BrandDTO";
import type { ViewCategoryDto } from "../types/CategoryDTO";
import { motion } from "framer-motion";
import { Gift, Tag, Calendar, ChevronRight, Sparkles, Percent, Globe, Package, Grid, Diamond } from "lucide-react";
import { formatVND } from "../utils/formatPrice";

const PromotionPage: React.FC = () => {
  const [promotions, setPromotions] = useState<ViewPromotionDto[]>([]);
  const [brands, setBrands] = useState<Record<number, string>>({});
  const [categories, setCategories] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [promos, brandList, categoryList] = await Promise.all([
          getPromotionsCustomerFilter(),
          getActiveBrands().catch(() => [] as ViewBrandDto[]),
          getCategories().catch(() => [] as ViewCategoryDto[]),
        ]);
        setPromotions(promos.filter((p) => p.isActive));

        // Map id -> name for lookup
        const brandMap: Record<number, string> = {};
        brandList.forEach((b) => { if (b.brandId) brandMap[b.brandId] = b.name ?? ""; });
        setBrands(brandMap);

        const catMap: Record<number, string> = {};
        categoryList.forEach((c) => { if (c.categoryId) catMap[c.categoryId] = c.name ?? ""; });
        setCategories(catMap);
      } catch (err) {
        console.error("Error fetching promotions:", err);
        setError("Không thể tải khuyến mãi. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getScopeLabel = (promo: ViewPromotionDto) => {
    if (promo.productId && Number(promo.productId) > 0) return "Sản phẩm cụ thể";
    if (promo.categoryId && Number(promo.categoryId) > 0) return categories[promo.categoryId] || "Danh mục";
    if (promo.brandId && Number(promo.brandId) > 0) return brands[promo.brandId] || "Thương hiệu";
    return "Toàn bộ sản phẩm";
  };

  const getScopeBadgeColor = (promo: ViewPromotionDto) => {
    if (promo.productId && Number(promo.productId) > 0) return "bg-purple-100 text-purple-700";
    if (promo.categoryId && Number(promo.categoryId) > 0) return "bg-blue-100 text-blue-700";
    if (promo.brandId && Number(promo.brandId) > 0) return "bg-orange-100 text-orange-700";
    return "bg-green-100 text-green-700";
  };

  const getDiscountBadgeText = (promo: ViewPromotionDto) => {
    const value = promo.discountValue ?? 0;
    if (value <= 0) return null;
    if (promo.discountType === 0) return `-${value}%`;
    if (promo.discountType === 1) return `-${formatVND(value)}`;
    if (promo.discountType === 2) return "FREESHIP";
    return null;
  };

  if (error) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <BreadcrumbHeader items={[{ label: "Khuyến mãi" }]} />
        <div className="flex-1 flex flex-col items-center justify-center text-gray-700 px-4 text-center">
          <div className="bg-red-50 p-6 rounded-full mb-4">
            <Gift className="w-12 h-12 text-red-400" />
          </div>
          <p className="text-xl font-medium text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-8 py-3 bg-[#a70001] text-white rounded-full font-bold hover:bg-black transition-all"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const globalPromotions = promotions
    .filter((p) => 
      (!p.productId || Number(p.productId) === 0) && 
      (!p.categoryId || Number(p.categoryId) === 0) && 
      (!p.brandId || Number(p.brandId) === 0)
    )
    .sort((a, b) => (b.discountValue ?? 0) - (a.discountValue ?? 0))
    .slice(0, 1);
  const brandPromotions = promotions.filter((p) => p.brandId && Number(p.brandId) > 0);
  const categoryPromotions = promotions.filter((p) => p.categoryId && Number(p.categoryId) > 0);
  const productPromotions = promotions.filter((p) => p.productId && Number(p.productId) > 0);

  const renderPromotionCard = (promo: ViewPromotionDto, index: number) => (
    <motion.div
      key={promo.promotionId}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100 flex-shrink-0">
        {promo.imageUrl ? (
          <img
            src={promo.imageUrl}
            alt={promo.name || ""}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
            <Gift className="w-16 h-16 text-red-200" />
          </div>
        )}
        {/* Discount badge */}
        {getDiscountBadgeText(promo) && (
          <div className="absolute top-4 right-4 bg-[#a70001] text-white font-['Tilt_Warp',sans-serif] text-xl px-4 py-1.5 rounded-2xl shadow-lg">
            {getDiscountBadgeText(promo)}
          </div>
        )}
        {/* Scope badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold max-w-[55%] truncate ${getScopeBadgeColor(promo)}`}>
          {getScopeLabel(promo)}
        </div>
      </div>

      {/* Content — flex-1 to push button to bottom */}
      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#a70001] transition-colors">
          {promo.name}
        </h2>

        {promo.description && (
          <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">
            {promo.description}
          </p>
        )}

        {/* Info chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {promo.discountType === 0 && (promo.discountValue ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
              <Percent className="w-3 h-3" />
              Giảm {promo.discountValue}%
            </div>
          )}
          {promo.discountType === 1 && (promo.discountValue ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
              <Tag className="w-3 h-3" />
              Giảm {formatVND(promo.discountValue ?? 0)}
            </div>
          )}
          {promo.discountType === 2 && (promo.discountValue ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
              <Tag className="w-3 h-3" />
              Freeship {formatVND(promo.discountValue ?? 0)}
            </div>
          )}
          {promo.endDate && (
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
              <Calendar className="w-3 h-3" />
              Đến {formatDate(promo.endDate)}
            </div>
          )}
          {(promo.minimumAmount ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
              <Tag className="w-3 h-3" />
              Tối thiểu {promo.minimumAmount!.toLocaleString("vi-VN")}₫
            </div>
          )}
        </div>

        {/* Button pinned to bottom */}
        <div className="mt-auto">
          <Link
            to={`/promotions/${promo.promotionId}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#a70001] text-white rounded-xl font-bold text-sm hover:bg-black transition-colors duration-300 group/btn"
          >
            Xem chi tiết
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );

  const renderSection = (title: string, promos: ViewPromotionDto[], icon: React.ReactNode) => {
    if (promos.length === 0) return null;
    return (
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-red-50 rounded-xl text-[#a70001]">
            {icon}
          </div>
          <h2 className="text-2xl md:text-3xl font-['Tilt_Warp',sans-serif] text-gray-900 uppercase">
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {promos.map((promo, index) => renderPromotionCard(promo, index))}
        </div>
      </section>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col overflow-x-hidden">
      <BreadcrumbHeader items={[{ label: "Khuyến mãi" }]} />

      <main className="flex-1 w-full max-w-[1300px] mx-auto px-4 md:px-8 py-12">

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-red-500" />
            <span className="text-red-600 text-sm font-bold uppercase tracking-wider">Ưu đãi đặc biệt</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-['Tilt_Warp',sans-serif] text-gray-900 leading-tight mb-4">
            Khuyến Mãi
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Khám phá các chương trình ưu đãi hấp dẫn đang diễn ra tại Toy Story
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-lg w-full" />
                  <div className="h-4 bg-gray-100 rounded-lg w-2/3" />
                  <div className="h-10 bg-gray-200 rounded-xl w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-24">
            <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-12 h-12 text-red-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Chưa có khuyến mãi</h2>
            <p className="text-gray-500">Hãy quay lại sau để xem các ưu đãi mới nhất!</p>
          </div>
        ) : (
          <div>
            {renderSection("Toàn bộ sản phẩm", globalPromotions, <Globe className="w-6 h-6" />)}
            {renderSection("Theo Thương hiệu", brandPromotions, <Diamond className="w-6 h-6" />)}
            {renderSection("Theo Phân loại", categoryPromotions, <Grid className="w-6 h-6" />)}
            {renderSection("Theo Sản phẩm", productPromotions, <Package className="w-6 h-6" />)}
          </div>
        )}
      </main>
    </div>
  );
};

export default PromotionPage;
