import React from "react";
import type { ViewBrandDto } from "../../types/BrandDTO";
import { SectionHeader } from "./SectionHeader";
import { Link } from "react-router-dom";
import { POLYGON_ARROW } from "../../constants/imageAssets";
import { ROUTES } from "../../routes/routePaths";
import { motion } from "framer-motion";

const image24 = "https://www.figma.com/api/mcp/asset/bc780d28-b30d-4701-8754-4995225b004d";

interface BrandsSectionProps {
  brands: ViewBrandDto[];
  isLoading: boolean;
}

export const BrandsSection = ({ brands, isLoading }: BrandsSectionProps): React.JSX.Element => {
  const displayBrands = brands.slice(0, 8);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <SectionHeader title="THƯƠNG HIỆU UY TÍN" variant="dark" />
      
      <div className="max-w-5xl mx-auto mt-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayBrands.map((brand, index) => (
            <Link 
              to={`/brands/${brand.brandId}`}
              key={brand.brandId ?? index}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-white rounded-2xl p-4 shadow-xl flex items-center justify-center h-28 border-4 border-transparent hover:border-red-100 transition-all group"
              >
                <img
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                  alt={brand.name ?? "Brand logo"}
                  src={brand.imageUrl ?? image24}
                />
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={ROUTES.BRANDS}
              className="group flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-white text-red-600 font-bold shadow-2xl hover:bg-red-50 transition-all border-2 border-transparent hover:border-white/50"
            >
              <span className="font-tilt-warp text-lg uppercase tracking-wider">Xem Thêm</span>
              <motion.img 
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-3 h-4 object-contain brightness-0 invert-[.5] sepia-0 saturate-100 hue-rotate-0 group-hover:invert-0 group-hover:brightness-100 transition-all" 
                alt="" 
                src={POLYGON_ARROW} 
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

