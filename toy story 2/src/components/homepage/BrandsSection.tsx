import React from "react";
import type { ViewBrandDto } from "../../types/BrandDTO";
import { SectionHeader } from "./SectionHeader";
import { SectionTitle } from "./SectionTitle";

// Figma MCP Asset URLs
const image132 = "https://www.figma.com/api/mcp/asset/90b57607-01f4-436a-84b7-bf19c8142dc8";
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
        iconSrc={image132}
        top="2019px"
        left="409px"
      />

      <SectionTitle top="2065px" left="371px">
        Thương hiệu uy tín
      </SectionTitle>

      {brands.length > 0 ? (
        <>
          {brandLogosRow1.map((logo, index) => (
            <img
              key={index}
              className="absolute top-[2193px] w-[195px] h-24 aspect-[2.03] object-contain bg-white rounded-lg p-2"
              style={{ left: logo.left }}
              alt={logo.alt || "Brand logo"}
              src={logo.src}
            />
          ))}

          {brandLogosRow2.map((logo, index) => (
            <img
              key={index}
              className="absolute top-[2308px] w-[195px] h-24 aspect-[2.03] object-contain bg-white rounded-lg p-2"
              style={{ left: logo.left }}
              alt={logo.alt || "Brand logo"}
              src={logo.src}
            />
          ))}
        </>
      ) : !isLoading && (
        <div className="absolute top-[2193px] left-[132px] w-[800px] text-center">
          <p className="[font-family:'Tilt_Warp-Regular',Helvetica] text-white text-lg">Không có thương hiệu</p>
        </div>
      )}
    </section>
  );
};

