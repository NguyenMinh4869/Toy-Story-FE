import React from "react";
import { SectionHeader } from "./SectionHeader";

export const GundamKingdomHeaderSection = (): React.JSX.Element => {
  return (
    <div className="w-full mb-8 text-center flex flex-col items-center">
      {/* This forces EVERY text element inside SectionHeader to be #a70001 */}
      <div className="[&_*]:!text-[#a70001]">
        <SectionHeader title="GUNDAM KINGDOM" variant="light" />
      </div>

      {/* Decorative red line */}
      <div className="h-1 w-24 bg-[#a70001] mt-2 rounded-full" />
    </div>
  );
};