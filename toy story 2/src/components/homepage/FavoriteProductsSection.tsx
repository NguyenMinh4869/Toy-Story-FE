import React from "react";
import type { ViewProductDto } from "../../types/ProductDTO";
import { SectionHeader } from "./SectionHeader";
import { SectionTitle } from "./SectionTitle";

// Figma MCP Asset URLs
const image13 = "https://www.figma.com/api/mcp/asset/90b57607-01f4-436a-84b7-bf19c8142dc8";
const decorDynamicBrand21 = "https://www.figma.com/api/mcp/asset/c18966b1-02ef-44dc-b6e0-7ce67b29570f";
const decorDynamicBrand22 = "https://www.figma.com/api/mcp/asset/c18966b1-02ef-44dc-b6e0-7ce67b29570f";
const decorDynamicBrand23 = "https://www.figma.com/api/mcp/asset/c18966b1-02ef-44dc-b6e0-7ce67b29570f";
const decorDynamicBrand24 = "https://www.figma.com/api/mcp/asset/c18966b1-02ef-44dc-b6e0-7ce67b29570f";
const image20 = "https://www.figma.com/api/mcp/asset/f8d42236-59cd-4852-bcb7-126b11fed0d1";
const image16 = "https://www.figma.com/api/mcp/asset/65922a4e-cf15-4803-971c-a52562301534";

interface FavoriteProductsSectionProps {
  products: ViewProductDto[];
  isLoading: boolean;
}

export const FavoriteProductsSection = ({ products, isLoading }: FavoriteProductsSectionProps): React.JSX.Element => {
  const decorBrands = [
    { src: decorDynamicBrand21, top: "1793px", left: "126px" },
    { src: decorDynamicBrand22, top: "1788px", left: "374px" },
    { src: decorDynamicBrand23, top: "1788px", left: "621px" },
    { src: decorDynamicBrand24, top: "1784px", left: "858px" },
  ];

  // Prepare favorite products images
  const favoriteToysImages = products.slice(0, 4).map((product, index) => ({
    src: product.imageUrl ?? image20,
    alt: product.name ?? 'Product',
    top: index === 0 ? "1811px" : index === 1 ? "1811px" : index === 2 ? "1810px" : "1808px",
    left: index === 0 ? "132px" : index === 1 ? "383px" : index === 2 ? "632px" : "866px"
  }));

  const favoriteToysLargeImages = products.slice(0, 4).map((product, index) => ({
    src: product.imageUrl ?? image16,
    alt: product.name ?? 'Product',
    top: "1806px",
    left: index === 0 ? "131px" : index === 1 ? "383px" : index === 2 ? "629px" : "866px",
    width: "202px",
    height: index === 0 ? "205px" : "208px",
    aspect: index === 0 ? "0.99" : "0.97"
  }));

  return (
    <section aria-label="Đồ chơi yêu thích">
      <SectionHeader 
        iconSrc={image13}
        top="1588px"
        left="397px"
      />

      <SectionTitle top="1692px" left="368px">
        Đồ chơi yêu thích
      </SectionTitle>

      {decorBrands.map((decor, index) => (
        <img
          key={index}
          className="w-[217px] h-9 absolute aspect-[6] object-cover"
          style={{ top: decor.top, left: decor.left }}
          alt="Brand decoration"
          src={decor.src}
        />
      ))}

      {products.length > 0 ? (
        <>
          {favoriteToysImages.map((img, index) => (
            <img
              key={index}
              className="w-[199px] h-[199px] absolute aspect-[1] object-cover"
              style={{ top: img.top, left: img.left }}
              alt={img.alt}
              src={img.src}
            />
          ))}

          {favoriteToysLargeImages.map((img, index) => (
            <img
              key={index}
              className="absolute object-cover"
              style={{
                top: img.top,
                left: img.left,
                width: img.width,
                height: img.height,
                aspectRatio: img.aspect,
              }}
              alt={img.alt}
              src={img.src}
            />
          ))}
        </>
      ) : !isLoading && (
        <div className="absolute top-[1811px] left-[132px] w-[800px] text-center">
          <p className="[font-family:'Tilt_Warp-Regular',Helvetica] text-white text-lg">Không có sản phẩm yêu thích</p>
        </div>
      )}
    </section>
  );
};

