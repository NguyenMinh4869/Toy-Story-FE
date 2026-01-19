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

// Navigation button configurations
const navigationButtons: NavigationButtonConfig[] = [
  { top: "1402px", left: "1107px", polygon: POLYGON_RIGHT, direction: "right" },
  { top: "1890px", left: "1105px", polygon: POLYGON_RIGHT, direction: "right" },
  { top: "881px", left: "1112px", polygon: POLYGON_CENTER, direction: "right" },
  { top: "277px", left: "1116px", polygon: POLYGON_CENTER, direction: "right" },
];

const navigationButtonsLeft: NavigationButtonConfig[] = [
  { top: "1413px", left: "42px", polygon: POLYGON_LEFT, direction: "left" },
  { top: "1890px", left: "54px", polygon: POLYGON_LEFT, direction: "left" },
  { top: "886px", left: "44px", polygon: POLYGON_LEFT, direction: "left" },
  { top: "292px", left: "39px", polygon: POLYGON_LEFT, direction: "left" },
];

export const Homepage = (): React.JSX.Element => {
  const [promotionalProducts, setPromotionalProducts] = useState<ViewProductDto[]>([]);
  const [gundamProducts, setGundamProducts] = useState<ViewProductDto[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<ViewProductDto[]>([]);
  const [brands, setBrands] = useState<ViewBrandDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch active products
        const allProducts = await getActiveProducts();
        
        // Fetch promotional products
        // TODO: Replace with actual promotional products endpoint when available
        // For now, use first 4 products as placeholder
        // In production, this should fetch products that have active promotions
        const promotional = allProducts.length > 0 ? allProducts.slice(0, 4) : [];
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
          ? allProducts.filter(p => p.categoryId === gundamCategory.categoryId).slice(0, 3)
          : allProducts.filter(p => 
              p.name?.toUpperCase().includes('GUNDAM') || 
              p.categoryName?.toUpperCase().includes('GUNDAM')
            ).slice(0, 3);
        setGundamProducts(gundam.length > 0 ? gundam : (allProducts.length > 0 ? allProducts.slice(0, 3) : []));

        // Fetch favorite products (top products or featured)
        // TODO: Replace with actual top/favorite products endpoint when available
        // For now, use first 4 products as placeholder
        // In production, this should fetch products marked as "top" or "featured"
        const favorites = allProducts.length > 0 ? allProducts.slice(0, 4) : [];
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


  return (
    <div className="bg-[#ab0007] w-full min-h-[3105px] relative">
      <main className="max-w-[1800px] mx-auto relative">
        <div className="relative" style={{ width: '1200px', margin: '0 auto' }}>
          {error && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
              <p className="[font-family:'Tilt_Warp-Regular',Helvetica] text-sm">{error}</p>
            </div>
          )}

          <HeroBannerSection />

          <PromotionalOffersSection products={promotionalProducts} isLoading={isLoading} />

          <FeaturedProductsBannerSection />

          <GundamKingdomHeaderSection />

          <GundamKingdomCardsSection products={gundamProducts} isLoading={isLoading} />

          <FavoriteProductsSection products={favoriteProducts} isLoading={isLoading} />

          <BrandsSection brands={brands} isLoading={isLoading} />

          <ShoppingGuideMainSection />

          {navigationButtons.map((btn, index) => (
            <NavigationButton key={`right-${index}`} config={btn} index={index} />
          ))}

          {navigationButtonsLeft.map((btn, index) => (
            <NavigationButton key={`left-${index}`} config={btn} index={index} />
          ))}
        </div>
      </main>
    </div>
  );
};

// Default export for routing compatibility
export default Homepage;
