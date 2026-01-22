import React from "react";
import { Link } from "react-router-dom";
import { SectionHeader } from "./SectionHeader";
import { SectionTitle } from "./SectionTitle";
import { ShoppingGuideSection } from "./ShoppingGuideSection";
import { ShoppingGuideContentSection } from "./ShoppingGuideContentSection";
import { SECTION_ICON, DECOR_DYNAMIC_BRAND, POLYGON_ARROW } from "../../constants/imageAssets";
import { ROUTES } from "../../routes/routePaths";

export const ShoppingGuideMainSection = (): React.JSX.Element => {
  return (
    <section aria-label="Cẩm nang mua sắm">
      <SectionHeader 
        iconSrc={SECTION_ICON}
        top="2404px"
        left="409px"
      />

      <SectionTitle top="2454px" left="371px">
        Cẩm nang mua sắm
      </SectionTitle>

      <ShoppingGuideSection />
      <ShoppingGuideContentSection />

      <Link 
        to={ROUTES.CAM_NANG}
        className="top-[2535px] left-[514px] w-[172px] h-[54px] absolute flex rounded-[34px] overflow-hidden bg-[linear-gradient(180deg,rgba(254,246,204,1)_3%,rgba(243,212,51,1)_100%)] hover:opacity-90 transition-opacity"
      >
        <span className="mt-[17px] w-[73px] h-[19px] ml-[49px] [font-family:'Tilt_Warp-Regular',Helvetica] text-[15px] font-normal text-[#ff0000] tracking-[0] leading-[normal]">
          Xem Thêm
        </span>
        <img
          className="mt-[22.8px] w-[8.25px] h-[10.39px] ml-[10.8px]"
          alt=""
          src={POLYGON_ARROW}
        />
      </Link>

      <img
        className="absolute top-[2589px] left-[152px] w-[399px] h-[67px] aspect-[6] object-cover"
        alt="Decorative brand element"
        src={DECOR_DYNAMIC_BRAND}
      />
    </section>
  );
};

