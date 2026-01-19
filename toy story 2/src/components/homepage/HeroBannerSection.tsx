import React from "react";

// Figma MCP Asset URLs
const image36 = "https://www.figma.com/api/mcp/asset/16661e53-92cf-4ab5-9f06-7c063eda908a";
const decorImageSlider11 = "https://www.figma.com/api/mcp/asset/e5fe30ab-bbfd-4bcc-9888-c3aa41d1059f";
const decorImageSlider21 = "https://www.figma.com/api/mcp/asset/7d376ed9-b011-4185-980e-795c277b1fdb";

export const HeroBannerSection = (): React.JSX.Element => {
  return (
    <section aria-label="Hero banner">
      <img
        className="absolute top-[165px] left-[111px] w-[994px] h-[306px] aspect-[3.25] object-cover"
        alt="Main banner"
        src={image36}
      />
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

