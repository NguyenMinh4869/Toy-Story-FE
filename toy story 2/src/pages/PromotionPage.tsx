import React, { useEffect, useState } from "react";
import { getPromotionsCustomerFilter } from "../services/promotionService";
import { filterProducts } from "../services/productService";
import { BreadcrumbHeader } from "../components/BreadcrumbHeader";
import { ProductCard } from "../components/ProductCard";
import { NavigationButton } from "../components/homepage/NavigationButton";
import type { ViewPromotionDto } from "../types/PromotionDTO";
import type { ViewProductDto } from "../types/ProductDTO";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Timer, ChevronRight, ShoppingBag } from "lucide-react";

const PromotionPage: React.FC = () => {
  const [promotions, setPromotions] = useState<ViewPromotionDto[]>([]);
  const [productsByPromo, setProductsByPromo] = useState<
    Record<number, ViewProductDto[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const promos = await getPromotionsCustomerFilter();
        setPromotions(promos);

        const productFetches = promos.slice(1).map(async (promo) => {
          try {
            let products: ViewProductDto[] = [];
            const filter: any = {};

            if (promo.productId) {
              filter.productId = promo.productId;
            } else {
              if (promo.categoryId) filter.categoryId = promo.categoryId;
              if (promo.brandId) filter.brandId = promo.brandId;
            }

            if (Object.keys(filter).length > 0) {
              products = await filterProducts(filter);
            }

            return {
              promoId: promo.promotionId,
              products: products.slice(0, 4),
            };
          } catch {
            return {
              promoId: promo.promotionId,
              products: [],
            };
          }
        });

        const results = await Promise.all(productFetches);
        const map: Record<number, ViewProductDto[]> = {};
        results.forEach(({ promoId, products }) => {
          map[promoId!] = products;
        });
        setProductsByPromo(map);
      } catch (err) {
        console.error("Error fetching promotions:", err);
        setError("Không thể tải khuyến mãi. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const SkeletonCard = () => (
    <div className="w-full h-[380px] bg-gray-200 animate-pulse rounded-[2.5rem] border border-gray-100" />
  );

  const BannerSkeleton = () => (
    <div className="w-full h-[300px] md:h-[280px] bg-gray-200 animate-pulse rounded-[2rem] border border-gray-100" />
  );

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

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col overflow-x-hidden">
      <BreadcrumbHeader items={[{ label: "Khuyến mãi" }]} />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-8 py-12 relative z-10">
        {/* Hero Banner Section */}
        <section className="mb-8">
          {loading ? (
            <BannerSkeleton />
          ) : (
            promotions[0] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative group rounded-xl overflow-hidden shadow-lg border border-gray-200 h-[200px] md:h-[280px]"
              >
                <img
                  src={promotions[0].imageUrl!}
                  alt={promotions[0].name || "Khuyến mãi hấp dẫn"}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Hero Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 text-white font-medium text-xs">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  <span>Ưu đãi Hot nhất tuần</span>
                </div>
              </motion.div>
            )
          )}
        </section>

        {/* Promotion Sections */}
        <div className="space-y-24">
          {loading ? (
            [1, 2].map((i) => (
              <div key={i} className="space-y-8">
                <div className="w-64 h-10 bg-gray-200 animate-pulse rounded-lg mx-auto" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
                </div>
              </div>
            ))
          ) : (
            promotions.slice(1).map((promo, index) => {
              const products = productsByPromo[promo.promotionId!] || [];
              const discountPercentage = promo.discountType === 0 ? (promo.discountValue ?? 0) : 0;

              return (
                <motion.section
                  key={promo.promotionId}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Section Title */}
                  <div className="flex flex-col items-center mb-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      className="bg-red-50 rounded-2xl p-3 border border-red-100 mb-4"
                    >
                      <Gift className="w-8 h-8 text-red-600" />
                    </motion.div>
                    <h2 className="font-['Rowdies',sans-serif] text-3xl md:text-5xl text-red-700 text-center tracking-tight mb-3">
                      {promo.name}
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-red-300 to-transparent rounded-full" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8 items-start">
                    {/* Left: Promotion Insight Card */}
                    <div className="space-y-6">
                      <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-xl overflow-hidden relative group"
                      >
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-100 rounded-full blur-3xl group-hover:bg-red-200 transition-colors" />

                        <img
                          src={promo.imageUrl!}
                          alt={promo.name || ""}
                          className="w-full h-48 object-cover rounded-2xl mb-6 shadow-lg transform transition-transform group-hover:scale-105"
                        />

                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-gray-600">
                            <Timer className="w-5 h-5 text-red-500" />
                            <span className="text-sm font-medium text-gray-700">Thời gian có hạn</span>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {promo.description || "Khám phá ngay bộ sưu tập đồ chơi chất lượng với giá ưu đãi cực hấp dẫn chỉ có tại Toy Story."}
                          </p>
                          {discountPercentage > 0 && (
                            <div className="inline-block px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-lg shadow-md">
                              Giảm tới {discountPercentage}%
                            </div>
                          )}
                        </div>
                      </motion.div>

                      <button
                        onClick={() => navigate("/products")}
                        className="w-full py-4 bg-[#a70001] text-white rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-2 hover:bg-black transition-all duration-300 shadow-xl group"
                      >
                        Xem thêm <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    {/* Right: Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      <AnimatePresence mode="popLayout">
                        {products.length > 0 ? (
                          products.slice(0, 3).map((product, pIdx) => (
                            <motion.div
                              key={product.productId}
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, delay: pIdx * 0.1 }}
                            >
                              <ProductCard
                                product={product}
                                discount={discountPercentage}
                                className="!w-full h-[400px]"
                              />
                            </motion.div>
                          ))
                        ) : (
                          <div className="col-span-full bg-white border border-gray-100 rounded-[2.5rem] py-20 flex flex-col items-center justify-center gap-4 shadow-sm">
                            <ShoppingBag className="w-12 h-12 text-gray-300" />
                            <p className="font-['Tilt_Warp',sans-serif] text-lg text-gray-500">Sản phẩm đang được cập nhật...</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Desktop Arrows */}
                  <div className="hidden 2xl:block">
                    <NavigationButton
                      config={{
                        direction: "left",
                        variant: "red",
                        className: "absolute left-[-80px] top-1/2 -translate-y-1/2 border-gray-200 bg-white hover:bg-gray-50 shadow-md",
                        onClick: () => { }
                      }}
                    />
                    <NavigationButton
                      config={{
                        direction: "right",
                        variant: "red",
                        className: "absolute right-[-80px] top-1/2 -translate-y-1/2 border-gray-200 bg-white hover:bg-gray-50 shadow-md",
                        onClick: () => { }
                      }}
                    />
                  </div>
                </motion.section>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default PromotionPage;
