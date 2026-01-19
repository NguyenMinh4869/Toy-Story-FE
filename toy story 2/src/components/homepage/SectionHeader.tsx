import React from "react";

interface SectionHeaderProps {
  iconSrc: string;
  iconAlt?: string;
  top?: string;
  left?: string;
}

export const SectionHeader = ({ 
  iconSrc, 
  iconAlt = "Section icon",
  top,
  left 
}: SectionHeaderProps): React.JSX.Element => {
  return (
    <div
      className="absolute w-[422px] h-[54px]"
      style={{
        top,
        left,
      }}
    >
      <div className="absolute top-[27px] left-[17px] w-[405px] h-1 bg-[#d8c59e]" />
      <img
        className="absolute top-px left-px w-[53px] h-[53px] aspect-[1] object-cover"
        alt={iconAlt}
        src={iconSrc}
      />
    </div>
  );
};

