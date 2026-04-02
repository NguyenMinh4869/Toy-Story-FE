import React from "react";
import { SectionHeader } from "./SectionHeader";

interface GundamKingdomHeaderSectionProps {
  variant?: 'dark' | 'light';
}

export const GundamKingdomHeaderSection = ({ variant = 'light' }: GundamKingdomHeaderSectionProps): React.JSX.Element => {
  return (
    <div className="w-full mb-8 text-center flex flex-col items-center">
      <SectionHeader title="GUNDAM KINGDOM" variant={variant} />
      <div className={`h-1 w-24 mt-2 rounded-full ${variant === 'dark' ? 'bg-white/70' : 'bg-[#a70001]'}`} />
    </div>
  );
};