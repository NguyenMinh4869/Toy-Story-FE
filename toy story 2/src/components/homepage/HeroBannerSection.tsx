import React from "react";
import { motion } from "framer-motion";
import { DECOR_FANS_INGOTS, DECOR_FIRECRACKERS_CLOUD } from "../../constants/imageAssets";
import { HomeCarousel, type CarouselSlide } from "./HomeCarousel";

const image36 = "https://www.figma.com/api/mcp/asset/16661e53-92cf-4ab5-9f06-7c063eda908a";

const paroselImagesModules = import.meta.glob("../../assets/parosel/*.{png,jpg,jpeg,webp,gif,svg}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const paroselImages = Object.entries(paroselImagesModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

interface HeroBannerSectionProps {
  page?: number;
  onPageChange?: (nextPage: number) => void;
  maxPages?: number;
}

export const HeroBannerSection = ({
  page = 0,
  onPageChange,
  maxPages,
}: HeroBannerSectionProps): React.JSX.Element => {
  const sourceImages = paroselImages.length > 0 ? paroselImages : [image36];
  const limit =
    typeof maxPages === "number" ? Math.max(1, Math.min(maxPages, sourceImages.length)) : sourceImages.length;
  const carouselSlides: CarouselSlide[] = sourceImages.slice(0, limit).map((src, i) => ({
    id: `parosel-${i + 1}`,
    image: src,
  }));

  const safePage = Math.max(0, Math.min(page, carouselSlides.length - 1));

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4">
      {/* Decorative elements with animations */}
      <motion.img
        initial={{ opacity: 0, x: -50, rotate: -10 }}
        animate={{ opacity: 1, x: 30, y: 30, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute -left-12 -top-12 w-48 h-48 object-contain z-20 pointer-events-none hidden lg:block"
        alt="Trang trí mây và pháo tết"
        src={DECOR_FIRECRACKERS_CLOUD}
      />

      <motion.img
        initial={{ opacity: 0, x: 50, rotate: 10 }}
        animate={{ opacity: 1, x: -20, y: 30, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute -right-12 -bottom-12 w-56 h-56 object-contain z-20 pointer-events-none hidden lg:block"
        alt="Trang trí quạt, mây và thỏi vàng"
        src={DECOR_FANS_INGOTS}
      />

      {/* Main Carousel with shadow and rounded corners */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
      >
        <HomeCarousel
          slides={carouselSlides}
          autoPlay={true}
          autoPlayInterval={5000}
          currentSlide={safePage}
          onSlideChange={onPageChange}
          heightClassName="h-[300px] md:h-[480px]"
        />
      </motion.div>
    </div>
  );
};

