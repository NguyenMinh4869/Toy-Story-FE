import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GundamKingdomCardsSection } from "../components/homepage/GundamKingdomCardsSection";
import { PromotionalOffersSection } from "../components/homepage/PromotionalOffersSection";
import { HeroBannerSection } from "../components/homepage/HeroBannerSection";import { GundamKingdomHeaderSection } from "../components/homepage/GundamKingdomHeaderSection";
import { FavoriteProductsSection } from "../components/homepage/FavoriteProductsSection";
import { BrandsSection } from "../components/homepage/BrandsSection";
import { getActiveProducts } from "../services/productService";
import { getActiveBrands } from "../services/brandService";
import { getCategories } from "../services/categoryService";
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
  const [favoriteProducts, setFavoriteProducts] = useState<ViewProductDto[]>([]);
  const [brands, setBrands] = useState<ViewBrandDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroPage, setHeroPage] = useState(0);
  const [promotionsPage, setPromotionsPage] = useState(0);
  const [gundamPage, setGundamPage] = useState(0);
  const [favoritesPage, setFavoritesPage] = useState(0);

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
        setFavoriteProducts(allProducts.slice(0, 12));
        
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
    <div className="bg-[#a70001] min-h-screen overflow-x-hidden">
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

      <main className="flex flex-col w-full">
        {/* Hero Section */}
        <section className="py-12 relative">
          <div className="max-w-7xl mx-auto px-4">
            <HeroBannerSection page={heroPage} onPageChange={setHeroPage} />
          </div>
        </section>

        {/* Promotions */}
        <motion.section 
          {...fadeInUp}
          className="py-16 md:py-24 relative overflow-hidden"
        >
          {/* Subtle decoration */}
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white/5 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <PromotionalOffersSection
              products={promotionalProducts}
              isLoading={isLoading}
              page={promotionsPage}
              onPageChange={setPromotionsPage}
              maxPages={3}
            />
          </div>
        </motion.section>


        {/* Gundam Kingdom */}
        <motion.section 
          {...fadeInUp}
          className="py-16 md:py-24 relative"
        >
          <div className="max-w-7xl mx-auto px-4">
            <GundamKingdomHeaderSection />
            <GundamKingdomCardsSection
              products={gundamProducts}
              isLoading={isLoading}
              page={gundamPage}
              onPageChange={setGundamPage}
              maxPages={3}
            />
          </div>
        </motion.section>

        {/* Favorite Products */}
        <motion.section 
          {...fadeInUp}
          className="py-16 md:py-24"
        >
          <div className="max-w-7xl mx-auto px-4">
            <FavoriteProductsSection
              products={favoriteProducts}
              isLoading={isLoading}
              page={favoritesPage}
              onPageChange={setFavoritesPage}
              maxPages={3}
            />
          </div>
        </motion.section>

        {/* Brands */}
        <motion.section 
          {...fadeInUp}
          className="py-16 md:py-24"
        >
          <div className="max-w-7xl mx-auto px-4">
            <BrandsSection brands={brands} isLoading={isLoading} />
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Homepage;
