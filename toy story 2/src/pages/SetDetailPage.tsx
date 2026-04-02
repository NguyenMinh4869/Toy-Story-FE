import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  Info,
  ChevronRight,
  Sparkles,
  Zap,
  Gift,
} from "lucide-react";
import type { ViewSetDetailDto } from "../types/SetDTO";
import { formatPrice } from "../utils/formatPrice";
import { useCart } from "../context/CartContext";
import { getSetById } from "../services/setService";
import { BreadcrumbHeader } from "../components/BreadcrumbHeader";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
const SetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [setData, setSetData] = useState<ViewSetDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { user, role } = useAuth();
  useEffect(() => {
    if (!id) return;
    const setId = Number(id);
    if (Number.isNaN(setId)) {
      setError("Mã bộ sưu tập không hợp lệ");
      setIsLoading(false);
      return;
    }
    const fetchSet = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getSetById(setId);
        setSetData(data);
      } catch (err) {
        console.error("Error fetching set:", err);
        setError("Không thể tải chi tiết bộ sưu tập. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSet();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddSetToCart = (): void => {
    if (setData?.setId) {
      addToCart(undefined, setData.setId, 1);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full"
        />
      </div>
    );
  }

  if (error || !setData) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-gray-50 p-10 rounded-[2rem] border border-gray-100 max-w-lg shadow-sm">
          <Info className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <p className="font-tilt-warp text-2xl text-gray-900 mb-6 uppercase tracking-wider">
            {error ?? "Bộ sưu tập không tồn tại."}
          </p>
          <Link
            to="/sets"
            className="inline-block bg-red-600 text-white px-8 py-4 rounded-2xl font-tilt-warp uppercase tracking-widest shadow-xl hover:bg-black transition-all hover:scale-105 active:scale-95"
          >
            Về trang bộ sưu tập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <BreadcrumbHeader
        items={[
          { label: "Bộ sưu tập", to: "/sets" },
          { label: setData.name ?? "Chi tiết" },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: Set Hero & Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 space-y-12"
          >
            {/* Header Content */}
            <div className="relative overflow-hidden rounded-[3rem] bg-white p-8 md:p-12 text-gray-900 shadow-2xl border-4 border-[#ca002a]/10">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Sparkles className="w-48 h-48 -mr-12 -mt-12 text-[#ca002a]" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                {setData.imageUrl && (
                  <div className="w-full md:w-72 aspect-square rounded-[2rem] overflow-hidden border-4 border-gray-50 shadow-2xl shrink-0 group">
                    <img
                      src={setData.imageUrl}
                      alt={setData.name ?? ""}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                )}

                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#ca002a] text-white text-[11px] font-black uppercase tracking-[0.2em] mb-6 shadow-lg shadow-[#ca002a]/20">
                    Sưu tập giới hạn
                  </div>
                  <h1 className="text-5xl md:text-7xl font-tilt-warp leading-none mb-6 uppercase tracking-tighter text-gray-900">
                    {setData.name}
                  </h1>
                  <p className="text-gray-500 font-red-hat leading-relaxed max-w-xl text-xl font-medium">
                    {setData.description ||
                      "Khám phá sự kết hợp độc đáo của những mẫu đồ chơi được tuyển chọn kỹ lưỡng trong bộ sưu tập này."}
                  </p>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 mt-12 pt-10 border-t border-gray-100">
                <div className="text-center group">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 transition-colors group-hover:text-[#ca002a]">
                    Số món
                  </p>
                  <p className="text-3xl font-tilt-warp text-gray-900 group-hover:scale-110 transition-transform">
                    {setData.totalItems ?? 0}
                  </p>
                </div>
                <div className="text-center border-x border-gray-100 group">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 transition-colors group-hover:text-[#ca002a]">
                    Ưu đãi
                  </p>
                  <p className="text-3xl font-tilt-warp text-[#ca002a] group-hover:scale-110 transition-transform">
                    -{setData.discountPercent ?? 0}%
                  </p>
                </div>
                <div className="text-center group">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 transition-colors group-hover:text-[#ca002a]">
                    Tiết kiệm
                  </p>
                  <p className="text-3xl font-tilt-warp text-[#ca002a] group-hover:scale-110 transition-transform">
                    {formatPrice(setData.savings ?? 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Product List Section */}
            <div>
              <div className="flex items-center justify-between mb-8 px-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-2 bg-red-600 rounded-full" />
                  <h2 className="text-2xl font-tilt-warp text-gray-900 uppercase">
                    Danh sách sản phẩm trong set
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {setData.products?.map((item, idx) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group flex gap-5 bg-gray-50 border border-gray-100 p-5 rounded-3xl hover:bg-white hover:shadow-xl hover:border-red-100 transition-all duration-300"
                  >
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                      <img
                        src={item.imageUrl || ""}
                        alt={item.productName ?? ""}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <Link
                        to={`/product/${item.productId}`}
                        className="font-tilt-warp text-gray-900 hover:text-red-600 transition-colors line-clamp-1 text-lg"
                      >
                        {item.productName}
                      </Link>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="font-bold text-gray-900 px-3 py-1 bg-white rounded-lg border border-gray-100 shadow-sm">
                          SL: {item.quantity}
                        </span>
                        <span className="text-gray-400 line-through text-xs font-medium">
                          {formatPrice(item.unitPrice ?? 0)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to={`/product/${item.productId}`}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:bg-gray-100 transition-all shadow-sm border border-gray-100"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Purchase Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 lg:sticky lg:top-8"
          >
            <div className="bg-white border-2 border-gray-100 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-bl-[5rem] -mr-8 -mt-8 -z-10 transition-all group-hover:scale-110" />

              <div className="mb-8">
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">
                  Giá trọn bộ
                </p>
                <div className="flex flex-col">
                  <span className="text-5xl font-tilt-warp text-gray-900 tracking-tight leading-none mb-2">
                    {formatPrice(setData.price ?? 0)}
                  </span>
                  {setData.savings && setData.savings > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-black italic">
                        TỐI ƯU HƠN
                      </span>
                      <span className="text-gray-400 text-sm font-medium">
                        Bạn tiết kiệm {formatPrice(setData.savings)}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100 transition-colors hover:bg-orange-50">
                  <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase">
                      Ưu đãi giới hạn
                    </p>
                    <p className="text-[10px] text-orange-700 font-medium">
                      Khám phá ngay bộ sưu tập duy nhất
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100 transition-colors hover:bg-purple-50">
                  <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase">
                      Quà tặng kèm
                    </p>
                    <p className="text-[10px] text-purple-700 font-medium">
                      Túi đựng cao cấp Toy Story
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 transition-colors hover:bg-blue-50">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase">
                      Freeship
                    </p>
                    <p className="text-[10px] text-blue-700 font-medium">
                      Miễn phí giao hàng toàn quốc
                    </p>
                  </div>
                </div>
              </div>

              {user && role === "Member" && (
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#000" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddSetToCart}
                  className="w-full bg-red-600 text-white h-20 rounded-[2rem] font-tilt-warp text-xl uppercase tracking-[0.1em] shadow-xl shadow-red-600/30 flex items-center justify-center gap-4 group transition-colors"
                >
                  <ShoppingCart className="w-7 h-7 group-hover:scale-110 transition-transform" />
                  Sở hữu ngay
                </motion.button>
              )}

              <p className="mt-8 text-center text-[10px] text-gray-400 font-medium tracking-wide uppercase px-4 leading-relaxed">
                * Sản phẩm được bảo hành chính hãng và hỗ trợ đổi trả trong 7
                ngày nếu có lỗi từ NSX.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SetDetailPage;
