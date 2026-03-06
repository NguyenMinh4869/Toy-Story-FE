import React from "react";

interface SectionHeaderProps {
  title: string;
  top?: string;
  className?: string; // Additional classes such as custom gap
}

export const SectionHeader = ({ 
  title,
  top,
  className = "gap-[23px]",
}: SectionHeaderProps): React.JSX.Element => {
  return (
    <div
      className={`absolute left-0 w-full flex flex-col items-center ${className}`}
      style={{
        top,
      }}
    >
      <div className="w-[405px] h-1 bg-[#d8c59e]" />
      
      <h2 
        className="[-webkit-text-stroke:1px_#c7b6b6] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,217,0,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Tilt_Warp-Regular',Helvetica] font-normal text-transparent text-5xl tracking-[0] leading-[normal] whitespace-nowrap"
      >
        {title}
      </h2>
    </div>
  );
};

