import React from "react";

interface SectionTitleProps {
  children: React.ReactNode;
  top?: string;
  left?: string;
}

export const SectionTitle = ({ 
  children, 
  top,
  left 
}: SectionTitleProps): React.JSX.Element => {
  return (
    <h2 
      className="absolute [-webkit-text-stroke:1px_#c7b6b6] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,217,0,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'Tilt_Warp-Regular',Helvetica] font-normal text-transparent text-5xl tracking-[0] leading-[normal]"
      style={{ top, left }}
    >
      {children}
    </h2>
  );
};

