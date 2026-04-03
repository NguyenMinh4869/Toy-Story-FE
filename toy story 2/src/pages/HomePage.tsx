import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GundamKingdomCardsSection } from "../components/homepage/GundamKingdomCardsSection";
import { PromotionalOffersSection } from "../components/homepage/PromotionalOffersSection";
import { HeroBannerSection } from "../components/homepage/HeroBannerSection";
import { GundamKingdomHeaderSection } from "../components/homepage/GundamKingdomHeaderSection";
import { SectionHeader } from "../components/homepage/SectionHeader";
import { BrandsSection } from "../components/homepage/BrandsSection";
import { getActiveProducts } from "../services/productService";
import { getActiveBrands } from "../services/brandService";
import { getCategories } from "../services/categoryService";
import { getPromotionsCustomerFilter } from "../services/promotionService";
import { findBestPromotion } from "../utils/promotionUtils";
import type { ViewProductDto } from "../types/ProductDTO";
import type { ViewBrandDto } from "../types/BrandDTO";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: "easeOut" }
};

export const Homepage = (): React.JSX.Element => {
  const [promotionalProducts, setPromotionalProducts] = useState<ViewProductDto[]>([]);
  const [gundamProducts, setGundamProducts] = useState<ViewProductDto[]>([]);
  const [brands, setBrands] = useState<ViewBrandDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroPage, setHeroPage] = useState(0);
  const [promotionsPage, setPromotionsPage] = useState(0);
  const [gundamPage, setGundamPage] = useState(0);
  const [allDisplayProducts, setAllDisplayProducts] = useState<ViewProductDto[]>([]);
  const [allProductsPage, setAllProductsPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [allProducts, promos] = await Promise.all([
          getActiveProducts(),
          getPromotionsCustomerFilter({ isActive: true }).catch(() => [])
        ]);

        // Apply best promotion to each product
        const enrichedProducts = allProducts.map((p) => {
          const promoInfo = findBestPromotion(p, promos);
          const originalPrice = p.price ?? 0;
          let finalPrice = originalPrice;
          let hasPromotion = false;

          if (promoInfo.hasPromotion && originalPrice > 0) {
            hasPromotion = true;
            if (promoInfo.discountType === 0) { // Percentage
              finalPrice = originalPrice * (1 - promoInfo.discountValue / 100);
            } else { // Fixed Amount
              finalPrice = Math.max(0, originalPrice - promoInfo.discountValue);
            }
          }

          return {
            ...p,
            hasPromotion,
            promotionName: hasPromotion ? promoInfo.label : undefined,
            finalPrice: finalPrice,
            originalPrice: originalPrice,
            promoInfo: promoInfo as any,
          };
        });

        // Filter products that actually have promotions for the "Hot Deals" section
        const promotional = enrichedProducts.filter(p => p.hasPromotion).slice(0, 12);
        setPromotionalProducts(promotional);

        const categories = await getCategories();
        const gundamCategory = categories.find(
          (c) => c.name?.toUpperCase().includes("GUNDAM") || c.name?.toUpperCase().includes("GUNDAM KINGDOM")
        );

        const gundam = gundamCategory
          ? enrichedProducts.filter((p) => p.categoryId === gundamCategory.categoryId).slice(0, 12)
          : enrichedProducts.filter((p) => p.name?.toUpperCase().includes("GUNDAM")).slice(0, 12);

        setGundamProducts(gundam);
        setAllDisplayProducts(enrichedProducts.slice(0, 12));

        const brandsData = await getActiveBrands();
        setBrands(brandsData);
      } catch (err) {
        console.error("Error fetching homepage data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  type SectionVariant = 'dark' | 'light';
  type SectionId = 'promo' | 'allProducts' | 'gundam' | 'brands';

  const sectionPlan = useMemo(() => {
    if (isLoading) return null;
    const candidates: SectionId[] = ['promo', 'allProducts', 'gundam', 'brands'];
    const visible = candidates.filter(id => {
      if (id === 'promo') return promotionalProducts.length > 0;
      if (id === 'allProducts') return allDisplayProducts.length > 0;
      if (id === 'gundam') return gundamProducts.length > 0;
      return true;
    });
    return visible.map((id, idx) => ({
      id,
      variant: (idx % 2 === 0 ? 'dark' : 'light') as SectionVariant,
      bg: idx % 2 === 0 ? 'bg-[#a70001]' : 'bg-white',
    }));
  }, [isLoading, promotionalProducts.length, allDisplayProducts.length, gundamProducts.length]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-white text-red-600 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
          >
            <span className="font-tilt-warp">{error}</span>
            <button onClick={() => setError(null)} className="hover:scale-110 transition-transform">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* HERO - always white */}
        <section className="pt-8 pb-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <HeroBannerSection page={heroPage} onPageChange={setHeroPage} />
          </div>
        </section>

        {/* LOADING SKELETON */}
        {isLoading && (
          <div className="py-20 bg-[#a70001]">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col items-center gap-3 mb-12">
                <div className="h-3 w-32 bg-white/20 rounded-full animate-pulse" />
                <div className="h-8 w-64 bg-white/20 rounded-full animate-pulse" />
                <div className="h-2 w-24 bg-white/20 rounded-full animate-pulse" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-64 bg-white/10 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DYNAMIC STRIPE SECTIONS */}
        {sectionPlan?.map(({ id, variant, bg }) => {
          const isDark = variant === 'dark';

          if (id === 'promo') return (
            <motion.section key="promo" {...fadeInUp} className={`py-20 ${bg}`}>
              <div className="max-w-7xl mx-auto px-4">
                <PromotionalOffersSection
                  products={promotionalProducts}
                  isLoading={false}
                  page={promotionsPage}
                  onPageChange={setPromotionsPage}
                  variant={variant}
                />
              </div>
            </motion.section>
          );

          if (id === 'allProducts') return (
            <motion.section key="allProducts" {...fadeInUp} className={`py-20 ${bg}`}>
              <div className="max-w-7xl mx-auto px-4">
                <SectionHeader title="TẤT CẢ SẢN PHẨM" variant={variant} />
                <div className="mt-12">
                  <GundamKingdomCardsSection
                    products={allDisplayProducts}
                    isLoading={false}
                    page={allProductsPage}
                    onPageChange={setAllProductsPage}
                    variant={variant}
                  />
                </div>
                <div className="flex justify-center mt-10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/products')}
                    className={`px-8 py-3 font-bold rounded-full transition-colors tracking-wide uppercase text-sm shadow-md ${
                      isDark ? 'bg-white text-[#a70001] hover:bg-gray-100' : 'bg-[#a70001] text-white hover:bg-red-800'
                    }`}
                  >
                    Xem tất cả
                  </motion.button>
                </div>
              </div>
            </motion.section>
          );

          if (id === 'gundam') return (
            <motion.section key="gundam" {...fadeInUp} className={`py-20 ${bg}`}>
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                  <span className={`font-bold tracking-widest uppercase text-sm ${isDark ? 'text-white/70' : 'text-red-600'}`}>
                    Premium Collection
                  </span>
                  <GundamKingdomHeaderSection variant={variant} />
                </div>
                <GundamKingdomCardsSection
                  products={gundamProducts}
                  isLoading={false}
                  page={gundamPage}
                  onPageChange={setGundamPage}
                  variant={variant}
                />
              </div>
            </motion.section>
          );

          if (id === 'brands') return (
            <motion.section key="brands" {...fadeInUp} className={`py-20 ${bg}`}>
              <div className="max-w-7xl mx-auto px-4">
                <BrandsSection brands={brands} isLoading={false} variant={variant} />
              </div>
            </motion.section>
          );

          return null;
        })}
      </main>
    </div>
  );
};

export default Homepage;
