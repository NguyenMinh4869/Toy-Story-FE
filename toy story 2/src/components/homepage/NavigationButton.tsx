import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export interface NavigationButtonConfig {
  top?: string;
  left?: string;
  polygon?: string;
  direction: "left" | "right";
  onClick?: () => void;
  useLucideIcon?: boolean;
  variant?: "gold" | "white" | "red";
  className?: string;
}

interface NavigationButtonProps {
  config: NavigationButtonConfig;
}

export const NavigationButton = ({ config }: NavigationButtonProps): React.JSX.Element => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (config.onClick) {
      config.onClick();
    }
  };

  const useLucideIcon = config.useLucideIcon !== false;
  
  const variantStyles = {
    gold: "bg-[linear-gradient(180deg,#E3B867_0%,#DCC7A0_100%)] border-white text-white",
    white: "bg-white border-red-100 text-red-600 shadow-lg hover:bg-red-50",
    red: "bg-red-600 border-white text-white shadow-xl hover:bg-red-700",
  }[config.variant || "gold"];

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-10 h-10 rounded-full border border-solid flex items-center justify-center transition-all active:scale-95 z-30",
        variantStyles,
        config.top && "absolute",
        config.className
      )}
      style={{ 
        top: config.top, 
        left: config.left,
      }}
      aria-label={config.direction === "left" ? "Previous" : "Next"}
    >
      {useLucideIcon ? (
        config.direction === "left" ? (
          <ChevronLeft className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )
      ) : (
        <img
          className={cn(
            "w-2 h-3 object-contain",
            config.direction === "left" ? "mr-0.5" : "ml-0.5"
          )}
          alt=""
          src={config.polygon}
        />
      )}
    </button>
  );
};

