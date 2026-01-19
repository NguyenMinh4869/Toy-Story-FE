import React from "react";
import { SectionTitle } from "./SectionTitle";

// Figma MCP Asset URLs
const image12 = "https://www.figma.com/api/mcp/asset/90b57607-01f4-436a-84b7-bf19c8142dc8";

export const GundamKingdomHeaderSection = (): React.JSX.Element => {
  return (
    <section aria-label="Gundam Kingdom">
      <div className="absolute top-[1099px] left-[398px] w-[405px] h-1 bg-[#d8c59e] border border-solid border-[#00000029]" />
      <img
        className="absolute top-[1073px] left-[382px] w-[53px] h-[53px] aspect-[1] object-cover"
        alt="Section icon"
        src={image12}
      />
      <SectionTitle top="1193px" left="368px">
        GUNDAM KINGDOM
      </SectionTitle>
    </section>
  );
};

