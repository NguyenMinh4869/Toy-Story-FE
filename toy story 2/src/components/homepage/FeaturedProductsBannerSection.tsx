import React from "react";
import { BANNER_LC2000 } from "../../constants/imageAssets";
import { motion } from "framer-motion";

export const FeaturedProductsBannerSection = (): React.JSX.Element => {
  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5 }}
      aria-label="Cơ hội cuối"
      className="w-full max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-xl border-4 border-white"
    >
      <img
        className="w-full h-auto object-cover hover:brightness-105 transition-all duration-500"
        alt="Cơ hội cuối - Mua nhanh kẻo lỡ"
        src={BANNER_LC2000}
      />
    </motion.section>
  );
};
