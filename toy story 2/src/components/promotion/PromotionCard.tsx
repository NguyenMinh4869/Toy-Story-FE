import { ViewPromotionSummaryDto } from "@/types/PromotionDTO";
import { ViewProductDto } from "@/types/ProductDTO";
import { useState, useEffect } from "react";
import { filterProductsPublic } from "@/services/productService";
import { Clock, Sparkles, Gift, ChevronRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
export const PromotionCard: React.FC<{
  promo: ViewPromotionSummaryDto;
  index: number;
}> = ({ promo }) => {
  const [products, setProducts] = useState<ViewProductDto[]>([]);
  const [loadingProds, setLoadingProds] = useState(false);

  useEffect(() => {
    const fetchPromoProducts = async () => {
      if (!promo.promotionId) return;
      try {
        setLoadingProds(true);
        const data = await filterProductsPublic({});
        setProducts(data.slice(0, 4));
      } catch (err) {
        console.error("Error fetching promo products:", err);
      } finally {
        setLoadingProds(false);
      }
    };
    fetchPromoProducts();
  }, [promo.promotionId]);

  const isExpired = promo.endDate
    ? new Date(promo.endDate) < new Date()
    : false;

  return (
    <div className="group relative bg-white rounded-[40px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#f0f0f0]">
      {/* Promotion Image/Banner */}
      <div className="relative h-[220px] overflow-hidden">
        <img
          src={
            promo.imageUrl ||
            "https://images.unsplash.com/photo-1545558014-868157bb5815?q=80&w=1000&auto=format&fit=crop"
          }
          alt={promo.name || ""}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-6 left-6 flex gap-2">
          {promo.isActive && !isExpired ? (
            <div className="bg-[#ca002a] text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-pulse">
              <Sparkles size={12} />
              ĐANG DIỄN RA
            </div>
          ) : (
            <div className="bg-gray-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <AlertCircle size={12} />
              ĐÃ KẾT THÚC
            </div>
          )}
        </div>

        {/* Floating Tag */}
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="font-sf-pro font-bold tracking-tight text-2xl text-white mb-2 line-clamp-1">
            {promo.name}
          </h3>
          <div className="flex items-center gap-2 text-white/80 text-xs font-sf-pro">
            <Clock size={14} className="text-[#ffd900]" />
            <span>
              {promo.startDate
                ? new Date(promo.startDate).toLocaleDateString("vi-VN")
                : "..."}{" "}
              -
              {promo.endDate
                ? new Date(promo.endDate).toLocaleDateString("vi-VN")
                : "..."}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <p className="font-sf-pro text-sm text-gray-500 leading-relaxed mb-8 h-[60px] overflow-hidden line-clamp-3">
          {promo.description}
        </p>

        {/* Product Preview (Mini Grid) */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex -space-x-3 overflow-hidden">
            {loadingProds
              ? [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-gray-100 animate-pulse"
                  />
                ))
              : products.length > 0
                ? products.map((p) => (
                    <div
                      key={p.productId}
                      className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-white overflow-hidden shadow-sm border border-[#f0f0f0]"
                    >
                      <img
                        src={p.imageUrl || ""}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))
                : [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="inline-block h-10 w-10 rounded-full ring-4 ring-white bg-[#f9f9f9] flex items-center justify-center"
                    >
                      <Gift size={18} className="text-[#ca002a]/10" />
                    </div>
                  ))}
          </div>

          <Link
            to={`/products?promotionId=${promo.promotionId}`}
            className="group/btn flex items-center gap-2 bg-[#ca002a] hover:bg-[#ab0007] text-white font-sf-pro font-bold tracking-wider text-xs px-6 py-3.5 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-md shadow-red-900/20"
          >
            SĂN DEAL NGAY
            <ChevronRight
              size={16}
              className="transition-transform group-hover/btn:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
