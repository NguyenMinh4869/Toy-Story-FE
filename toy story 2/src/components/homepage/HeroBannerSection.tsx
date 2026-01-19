import React, { useEffect } from "react";

// Figma MCP Asset URLs
const image36 = "https://www.figma.com/api/mcp/asset/16661e53-92cf-4ab5-9f06-7c063eda908a";
const decorImageSlider11 = "https://www.figma.com/api/mcp/asset/e5fe30ab-bbfd-4bcc-9888-c3aa41d1059f";
const decorImageSlider21 = "https://www.figma.com/api/mcp/asset/7d376ed9-b011-4185-980e-795c277b1fdb";

interface HeroBannerSectionProps {
  page?: number;
  onPageChange?: (nextPage: number) => void;
  maxPages?: number;
}

export const HeroBannerSection = ({
  page = 0,
  onPageChange,
  maxPages = 3,
}: HeroBannerSectionProps): React.JSX.Element => {
  // NOTE: Only one hero image is currently available in the repo.
  // We still implement the carousel so you can later swap in real slide images.
  const slides = Array.from({ length: Math.max(1, maxPages) }).map(() => image36);
  const pageCount = slides.length;
  const safePage = Math.max(0, Math.min(page, pageCount - 1));

  useEffect(() => {
    if (safePage !== page) onPageChange?.(safePage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safePage]);

  return (
    <section aria-label="Hero banner">
      <div className="absolute top-[165px] left-[111px] w-[994px] h-[306px] rounded-[20px] overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${safePage * 100}%)` }}
        >
          {slides.map((src, i) => (
            <img
              key={`hero-slide-${i}`}
              className="w-full h-full shrink-0 object-cover"
              alt={`Main banner ${i + 1}`}
              src={src}
            />
          ))}
        </div>
      </div>

      <img
        className="absolute top-[143px] left-[65px] w-[248px] h-[248px] aspect-[1] object-cover"
        alt="Decorative slider element"
        src={decorImageSlider11}
      />
      <img
        className="absolute top-[343px] left-[850px] w-[296px] h-[148px] aspect-[2] object-cover"
        alt="Decorative slider element"
        src={decorImageSlider21}
      />
    </section>
  );
};

