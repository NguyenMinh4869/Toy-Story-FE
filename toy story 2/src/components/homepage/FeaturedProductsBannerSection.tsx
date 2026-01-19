import React from "react";

const LC2000WebTop1 = "https://www.figma.com/api/mcp/asset/095730ed-dfd3-46e4-8510-9a4f5cea6f1b";
const decorTopProductCard = "https://www.figma.com/api/mcp/asset/cb65df8d-ab94-4273-904d-f9d409106b68";

export const FeaturedProductsBannerSection = (): React.JSX.Element => {
  return (
    <section aria-label="Featured products">
      <img
        className="absolute top-[584px] left-[111px] w-[991px] h-[149px] aspect-[6.67] object-cover"
        alt="Promotional banner"
        src={LC2000WebTop1}
      />

      {/* First card decoration - ADD THIS */}
      <img
        className="absolute top-[748px] left-[161px] w-[157px] h-[53px] aspect-[2.95] object-cover"
        alt="Product card decoration"
        src={decorTopProductCard}
      />

      {/* Second card decoration */}
      <img
        className="absolute top-[748px] left-[406px] w-[157px] h-[53px] aspect-[2.95] object-cover"
        alt="Product card decoration"
        src={decorTopProductCard}
      />

      {/* Third card decoration */}
      <img
        className="absolute top-[742px] left-[651px] w-[157px] h-[53px] aspect-[2.95] object-cover"
        alt="Product card decoration"
        src={decorTopProductCard}
      />

      {/* Fourth card decoration */}
      <img
        className="absolute top-[742px] left-[885px] w-[157px] h-[53px] aspect-[2.95] object-cover"
        alt="Product card decoration"
        src={decorTopProductCard}
      />
    </section>
  );
};