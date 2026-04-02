import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBrandById } from "../services/brandService";
import { getProductsByBrandId } from "../services/productService";
import { getPromotionsCustomerFilter } from "../services/promotionService";
import { ProductCard } from "../components/ProductCard";
import { BreadcrumbHeader } from "../components/BreadcrumbHeader";
import { findBestPromotion } from "../utils/promotionUtils";
import type { ViewBrandDto } from "../types/BrandDTO";
import type { ProductDTO } from "../types/ProductDTO";
import { motion } from "framer-motion";

const BrandDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [brand, setBrand] = useState<ViewBrandDto | null>(null);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const [brandData, productsData, promos] = await Promise.all([
          getBrandById(Number(id)),
          getProductsByBrandId(Number(id)),
          getPromotionsCustomerFilter({ isActive: true }).catch(() => []),
        ]);
        setBrand(brandData);

        // Áp promotion tốt nhất cho mỗi sản phẩm
        const enriched: ProductDTO[] = productsData.map((product) => {
          const promoInfo = findBestPromotion(product, promos);
          const originalPrice = product.price ?? 0;
          let finalPrice = originalPrice;
          let hasPromotion = false;

          if (promoInfo.hasPromotion && originalPrice > 0) {
            hasPromotion = true;
            if (promoInfo.discountType === 0) {
              finalPrice = originalPrice * (1 - promoInfo.discountValue / 100);
            } else {
              finalPrice = Math.max(0, originalPrice - promoInfo.discountValue);
            }
          }

          return {
            ...product,
            hasPromotion,
            promotionName: hasPromotion ? promoInfo.label : undefined,
            finalPrice: finalPrice,
            originalPrice: originalPrice,
            promoInfo: promoInfo as any,
          };
        });
        setProducts(enriched);
      } catch (err) {
        console.error("Error fetching brand details:", err);
        setError("Không thể tải thông tin nhãn hàng. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#a70001] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="min-h-screen bg-[#a70001] flex flex-col items-center justify-center p-4">
        <p className="text-white text-xl font-tilt-warp mb-4">{error || "Không tìm thấy nhãn hàng"}</p>
        <a href="/" className="text-white underline font-medium">Quay lại trang chủ</a>
      </div>
    );
  }

  return (
    <div className="bg-[#a70001] min-h-screen flex flex-col">
      <BreadcrumbHeader items={[{ label: "Thương hiệu", to: "/brands" }, { label: brand.name ?? "Chi tiết" }]} />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-[3rem] p-8 mb-12 border border-white/20 flex flex-col md:flex-row items-center gap-8 shadow-2xl"
        >
          <div className="w-48 h-48 bg-white rounded-3xl p-4 shadow-xl flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src={brand.imageUrl ?? ""} 
              alt={brand.name ?? "Brand logo"} 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-tilt-warp text-white mb-4 uppercase tracking-tight">
              {brand.name}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl font-medium">
              Khám phá bộ sưu tập đầy đủ các sản phẩm chất lượng nhất từ {brand.name}. 
              Cam kết chính hãng và trải nghiệm tuyệt vời cho mọi khách hàng.
            </p>
          </div>
        </motion.div>

        <section>
          <div className="flex items-center gap-4 mb-8 px-2">
            <div className="h-8 w-1.5 bg-white rounded-full" />
            <h2 className="text-2xl font-tilt-warp text-white uppercase tracking-wider">
              Sản phẩm {brand.name} ({products.length})
            </h2>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
              {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/20">
              <p className="text-white/60 font-tilt-warp text-xl tracking-wide">
                Hiện tại chưa có sản phẩm nào thuộc nhãn hàng này.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default BrandDetailPage;
