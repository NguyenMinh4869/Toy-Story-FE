import React, { useState, useEffect } from "react";
import { GundamKingdomCardsSection } from "../components/homepage/GundamKingdomCardsSection";
import { PromotionalOffersSection } from "../components/homepage/PromotionalOffersSection";
import { HeroBannerSection } from "../components/homepage/HeroBannerSection";
import { FeaturedProductsBannerSection } from "../components/homepage/FeaturedProductsBannerSection";
import { GundamKingdomHeaderSection } from "../components/homepage/GundamKingdomHeaderSection";
import { FavoriteProductsSection } from "../components/homepage/FavoriteProductsSection";
import { BrandsSection } from "../components/homepage/BrandsSection";
import { ShoppingGuideMainSection } from "../components/homepage/ShoppingGuideMainSection";
import { NavigationButton, type NavigationButtonConfig } from "../components/homepage/NavigationButton";
import { getActiveProducts } from "../services/productService";
import { getActiveBrands } from "../services/brandService";
import { getCategories } from "../services/categoryService";
import { POLYGON_RIGHT, POLYGON_LEFT, POLYGON_CENTER } from "../constants/imageAssets";
import type { ViewProductDto } from "../types/ProductDTO";
import type { ViewBrandDto } from "../types/BrandDTO";

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

        // Fetch active products
        const allProducts = await getActiveProducts();
        
        // Fetch promotional products
        // TODO: Replace with actual promotional products endpoint when available
        // For now, take up to 3 "pages" (4 per page) so the carousel can paginate.
        // In production, this should fetch products that have active promotions.
        const promotional = allProducts.length > 0 ? allProducts.slice(0, 12) : [];
        setPromotionalProducts(promotional);

        // Fetch Gundam products by filtering
        // First, get categories to find GUNDAM categoryId
        const categories = await getCategories();
        const gundamCategory = categories.find(c => 
          c.name?.toUpperCase().includes('GUNDAM') || 
          c.name?.toUpperCase().includes('GUNDAM KINGDOM')
        );
        
        // Filter products by categoryId if found, otherwise by name
        const gundam = gundamCategory 
          ? allProducts.filter(p => p.categoryId === gundamCategory.categoryId).slice(0, 9)
          : allProducts.filter(p => 
              p.name?.toUpperCase().includes('GUNDAM') || 
              p.categoryName?.toUpperCase().includes('GUNDAM')
            ).slice(0, 9);
        setGundamProducts(gundam.length > 0 ? gundam : (allProducts.length > 0 ? allProducts.slice(0, 9) : []));

        // Fetch favorite products (top products or featured)
        // TODO: Replace with actual top/favorite products endpoint when available
        // For now, use first 4 products as placeholder
        // In production, this should fetch products marked as "top" or "featured"
        const favorites = allProducts.length > 0 ? allProducts.slice(0, 12) : [];
        setFavoriteProducts(favorites);

        // Fetch active brands
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

  const promotionsPageCount = Math.max(1, Math.min(3, Math.ceil(promotionalProducts.length / 4)));
  const goPromotionsNext = () =>
    setPromotionsPage((p) => (promotionsPageCount <= 1 ? 0 : (p + 1) % promotionsPageCount));
  const goPromotionsPrev = () =>
    setPromotionsPage((p) =>
      promotionsPageCount <= 1 ? 0 : (p - 1 + promotionsPageCount) % promotionsPageCount
    );

  const heroPageCount = 3;
  const goHeroNext = () => setHeroPage((p) => (heroPageCount <= 1 ? 0 : (p + 1) % heroPageCount));
  const goHeroPrev = () =>
    setHeroPage((p) => (heroPageCount <= 1 ? 0 : (p - 1 + heroPageCount) % heroPageCount));

  const gundamPageCount = Math.max(1, Math.min(3, Math.ceil(gundamProducts.length / 3)));
  const goGundamNext = () =>
    setGundamPage((p) => (gundamPageCount <= 1 ? 0 : (p + 1) % gundamPageCount));
  const goGundamPrev = () =>
    setGundamPage((p) => (gundamPageCount <= 1 ? 0 : (p - 1 + gundamPageCount) % gundamPageCount));

  const favoritesPageCount = Math.max(1, Math.min(3, Math.ceil(favoriteProducts.length / 4)));
  const goFavoritesNext = () =>
    setFavoritesPage((p) => (favoritesPageCount <= 1 ? 0 : (p + 1) % favoritesPageCount));
  const goFavoritesPrev = () =>
    setFavoritesPage((p) =>
      favoritesPageCount <= 1 ? 0 : (p - 1 + favoritesPageCount) % favoritesPageCount
    );

  // Navigation button configurations
  const navigationButtons: NavigationButtonConfig[] = [
    // Gundam carousel (right)
    { top: "1402px", left: "1107px", polygon: POLYGON_RIGHT, direction: "right", onClick: goGundamNext },
    // Favorites carousel (right)
    { top: "1890px", left: "1105px", polygon: POLYGON_RIGHT, direction: "right", onClick: goFavoritesNext },
    // Promotions carousel (right)
    { top: "881px", left: "1112px", polygon: POLYGON_CENTER, direction: "right", onClick: goPromotionsNext },
    // Hero carousel (right)
    { top: "277px", left: "1116px", polygon: POLYGON_CENTER, direction: "right", onClick: goHeroNext },
  ];

  const navigationButtonsLeft: NavigationButtonConfig[] = [
    // Gundam carousel (left)
    { top: "1413px", left: "42px", polygon: POLYGON_LEFT, direction: "left", onClick: goGundamPrev },
    // Favorites carousel (left)
    { top: "1890px", left: "54px", polygon: POLYGON_LEFT, direction: "left", onClick: goFavoritesPrev },
    // Promotions carousel (left)
    { top: "886px", left: "44px", polygon: POLYGON_LEFT, direction: "left", onClick: goPromotionsPrev },
    // Hero carousel (left)
    { top: "292px", left: "39px", polygon: POLYGON_LEFT, direction: "left", onClick: goHeroPrev },
  ];

  return (
    <div className="bg-[#ab0007] w-full min-h-[3105px] relative">
      <main className="max-w-[1800px] mx-auto relative">
        <div className="relative" style={{ width: '1200px', margin: '0 auto' }}>
          {error && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
              <p className="[font-family:'Tilt_Warp-Regular',Helvetica] text-sm">{error}</p>
            </div>
          )}

          <HeroBannerSection page={heroPage} onPageChange={setHeroPage} maxPages={3} />

          <PromotionalOffersSection
            products={promotionalProducts}
            isLoading={isLoading}
            page={promotionsPage}
            onPageChange={setPromotionsPage}
            maxPages={3}
          />

          <FeaturedProductsBannerSection />

          <GundamKingdomHeaderSection />

          <GundamKingdomCardsSection
            products={gundamProducts}
            isLoading={isLoading}
            page={gundamPage}
            onPageChange={setGundamPage}
            maxPages={3}
          />

          <FavoriteProductsSection
            products={favoriteProducts}
            isLoading={isLoading}
            page={favoritesPage}
            onPageChange={setFavoritesPage}
            maxPages={3}
          />

          <BrandsSection brands={brands} isLoading={isLoading} />

          <ShoppingGuideMainSection />

          {navigationButtons.map((btn, index) => (
            <NavigationButton key={`right-${index}`} config={btn} />
          ))}

          {navigationButtonsLeft.map((btn, index) => (
            <NavigationButton key={`left-${index}`} config={btn} />
          ))}
        </div>
      </main>
    </div>
  );
};

// Default export for routing compatibility
export default Homepage;
