import React from "react";
import type { ViewBrandDto } from "../../types/BrandDTO";
import { SectionHeader } from "./SectionHeader";
import { Link } from "react-router-dom";
import { POLYGON_ARROW } from "../../constants/imageAssets";
import { ROUTES } from "../../routes/routePaths";

const image24 = "https://www.figma.com/api/mcp/asset/bc780d28-b30d-4701-8754-4995225b004d";

interface BrandsSectionProps {
  brands: ViewBrandDto[];
  isLoading: boolean;
}

export const BrandsSection = ({ brands, isLoading }: BrandsSectionProps): React.JSX.Element => {
  // Prepare brand logos for display (first 8 brands)
  const displayBrands = brands.slice(0, 8);
  const brandLogosRow1 = displayBrands.slice(0, 4).map((brand, index) => ({
    src: brand.imageUrl ?? image24,
    left: index === 0 ? "132px" : index === 1 ? "372px" : index === 2 ? "625px" : "866px",
    alt: brand.name ?? 'Brand'
  }));
  const brandLogosRow2 = displayBrands.slice(4, 8).map((brand, index) => ({
    src: brand.imageUrl ?? image24,
    left: index === 0 ? "132px" : index === 1 ? "372px" : index === 2 ? "625px" : "866px",
    alt: brand.name ?? 'Brand'
  }));

  return (
    <section aria-label="Thương hiệu uy tín">
      <SectionHeader 
        title="Thương hiệu uy tín"
        top="2162px"
      />

      {brands.length > 0 ? (
        <>
          {brandLogosRow1.map((logo, index) => (
            <img
              key={index}
              className="absolute top-[2336px] w-[195px] h-24 aspect-[2.03] object-contain bg-white rounded-lg p-2"
              style={{ left: logo.left }}
              alt={logo.alt || "Brand logo"}
              src={logo.src}
            />
          ))}

          {brandLogosRow2.map((logo, index) => (
            <img
              key={index}
              className="absolute top-[2451px] w-[195px] h-24 aspect-[2.03] object-contain bg-white rounded-lg p-2"
              style={{ left: logo.left }}
              alt={logo.alt || "Brand logo"}
              src={logo.src}
            />
          ))}

          <Link
            to={ROUTES.BRANDS}
            className="absolute top-[2273px] left-[514px] w-[172px] h-[54px] flex items-center justify-center gap-2 rounded-[34px] bg-[linear-gradient(180deg,rgba(254,246,204,1)_3%,rgba(243,212,51,1)_100%)] hover:opacity-90 no-underline text-[#c40029] font-tilt-warp text-[15px] whitespace-nowrap"
          >
            Xem Thêm
            <img className="w-2 h-2.5 object-contain" alt="" src={POLYGON_ARROW} />
          </Link>
        </>
      ) : !isLoading && (
        <div className="absolute top-[2193px] left-[132px] w-[800px] text-center">
          <p className="[font-family:'Tilt_Warp-Regular',Helvetica] text-white text-lg">Không có thương hiệu</p>
        </div>
      )}
    </section>
  );
};

