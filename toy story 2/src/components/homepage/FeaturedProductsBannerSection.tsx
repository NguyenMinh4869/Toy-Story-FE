import React from "react";
import { BANNER_LC2000 } from "../../constants/imageAssets";

export const FeaturedProductsBannerSection = (): React.JSX.Element => {
  return (
    <section aria-label="Cơ hội cuối">
      <img
        className="absolute top-[584px] left-[111px] w-[991px] h-[149px] object-contain object-center"
        alt="Cơ hội cuối - Mua nhanh kẻo lỡ"
        src={BANNER_LC2000}
      />
    </section>
  );
};
