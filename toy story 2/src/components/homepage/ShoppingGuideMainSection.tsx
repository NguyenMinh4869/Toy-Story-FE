import React from "react";
import { Link } from "react-router-dom";
import { SectionHeader } from "./SectionHeader";
import { ShoppingGuideSection } from "./ShoppingGuideSection";
import { ShoppingGuideContentSection } from "./ShoppingGuideContentSection";
import { DECOR_DYNAMIC_BRAND, POLYGON_ARROW } from "../../constants/imageAssets";
import { ROUTES } from "../../routes/routePaths";

export const ShoppingGuideMainSection = (): React.JSX.Element => {
  return (
    <section aria-label="Cẩm nang mua sắm">
      <SectionHeader 
        title="Cẩm nang mua sắm"
        top="2607px"
      />

      <ShoppingGuideSection />
      <ShoppingGuideContentSection />

      <Link 
        to={ROUTES.CAM_NANG}
        className="top-[2738px] left-[514px] w-[172px] h-[54px] absolute flex items-center justify-center gap-2 rounded-[34px] bg-[linear-gradient(180deg,rgba(254,246,204,1)_3%,rgba(243,212,51,1)_100%)] hover:opacity-90 transition-opacity no-underline"
      >
        <span className="font-tilt-warp text-[15px] font-normal text-[#c40029] whitespace-nowrap leading-none">
          Xem Thêm
        </span>
        <img
          className="w-2 h-2.5 object-contain"
          alt=""
          src={POLYGON_ARROW}
        />
      </Link>

      <img
        className="absolute top-[2792px] left-[152px] w-[399px] h-[67px] aspect-[6] object-cover"
        alt="Decorative brand element"
        src={DECOR_DYNAMIC_BRAND}
      />
    </section>
  );
};

