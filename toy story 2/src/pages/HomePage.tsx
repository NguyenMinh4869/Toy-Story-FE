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

        setGundamProducts(gundam.length > 0 ? gundam : enrichedProducts.slice(0, 12));

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
