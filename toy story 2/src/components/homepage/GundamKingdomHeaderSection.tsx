import React from "react";
import { SectionHeader } from "./SectionHeader";

export const GundamKingdomHeaderSection = (): React.JSX.Element => {
  return (
    <section aria-label="Gundam Kingdom">
      <SectionHeader 
        title="GUNDAM KINGDOM"
        top="1099px"
        className="gap-[70px]"
      />
    </section>
  );
};

