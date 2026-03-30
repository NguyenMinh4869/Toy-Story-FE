import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GundamKingdomCardsSection } from "../components/homepage/GundamKingdomCardsSection";
import { PromotionalOffersSection } from "../components/homepage/PromotionalOffersSection";
import { HeroBannerSection } from "../components/homepage/HeroBannerSection"; import { GundamKingdomHeaderSection } from "../components/homepage/GundamKingdomHeaderSection";
import { BrandsSection } from "../components/homepage/BrandsSection";
import { getActiveProducts } from "../services/productService";
import { getActiveBrands } from "../services/brandService";
import { getCategories } from "../services/categoryService";
import { getPromotionsCustomerFilter } from "../services/promotionService";
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
  const [promotionDiscountValue, setPromotionDiscountValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allProducts = await getActiveProducts();

        const promotional = allProducts.length > 0 ? allProducts.slice(0, 12) : [];
        setPromotionalProducts(promotional);

        const categories = await getCategories();
        const gundamCategory = categories.find(
          (c) => c.name?.toUpperCase().includes("GUNDAM") || c.name?.toUpperCase().includes("GUNDAM KINGDOM")
        );

        const gundam = gundamCategory
          ? allProducts.filter((p) => p.categoryId === gundamCategory.categoryId).slice(0, 12)
          : allProducts.filter((p) => p.name?.toUpperCase().includes("GUNDAM")).slice(0, 12);

        setGundamProducts(gundam.length > 0 ? gundam : allProducts.slice(0, 12));

        const brandsData = await getActiveBrands();
        setBrands(brandsData);

        // Fetch active promotions to get the real discount percentage
        try {
          const promos = await getPromotionsCustomerFilter();
          // Prefer a percentage-type promotion (discountType === 0)
          const activePromo = promos.find(
            (p) => p.isActive && p.discountType === 0 && (p.discountValue ?? 0) > 0
          ) ?? promos.find((p) => p.isActive && (p.discountValue ?? 0) > 0);
          if (activePromo?.discountValue) {
            setPromotionDiscountValue(activePromo.discountValue);
          }
        } catch {
          // silently ignore – badge simply won't show
        }
      } catch (err) {
        console.error("Error fetching homepage data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
        {/* 1. HERO - Clean background */}
        <section className="pt-8 pb-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <HeroBannerSection page={heroPage} onPageChange={setHeroPage} />
          </div>
        </section>

        {/* 2. PROMOTIONS - Light gray/blue tint to separate from Hero */}
        <motion.section {...fadeInUp} className="py-20 bg-[#a70001] border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <PromotionalOffersSection
              products={promotionalProducts}
              isLoading={isLoading}
              page={promotionsPage}
              onPageChange={setPromotionsPage}
              promotionDiscountValue={promotionDiscountValue}
            />
          </div>
        </motion.section>

        {/* 3. GUNDAM KINGDOM - White background, emphasized header */}
        <motion.section {...fadeInUp} className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-red-600 font-bold tracking-widest uppercase text-sm">Premium Collection</span>
              <GundamKingdomHeaderSection />
            </div>
            <GundamKingdomCardsSection
              products={gundamProducts}
              isLoading={isLoading}
              page={gundamPage}
              onPageChange={setGundamPage}
            />
          </div>
        </motion.section>

        {/* 4. BRANDS - Simple and clean */}
        <motion.section {...fadeInUp} className="py-20 bg-[#a70001]">
          <div className="max-w-7xl mx-auto px-4">
            <BrandsSection brands={brands} isLoading={isLoading} />
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Homepage;
