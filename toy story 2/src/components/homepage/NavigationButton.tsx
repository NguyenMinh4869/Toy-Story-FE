import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface NavigationButtonConfig {
  top: string;
  left: string;
  polygon?: string;
  direction: "left" | "right";
  onClick?: () => void;
  useLucideIcon?: boolean;
}

interface NavigationButtonProps {
  config: NavigationButtonConfig;
}

export const NavigationButton = ({ config }: NavigationButtonProps): React.JSX.Element => {
  const handleClick = () => {
    if (config.onClick) {
      config.onClick();
    }
  };

  const useLucideIcon = config.useLucideIcon !== false;

  return (
    <button
      onClick={handleClick}
      className="w-[33px] h-[31px] rounded-[16.5px/15.5px] border border-solid border-white bg-[linear-gradient(180deg,rgba(227,184,103,1)_0%,rgba(220,199,160,1)_100%)] absolute flex items-center justify-center"
      style={{ top: config.top, left: config.left }}
      aria-label={config.direction === "left" ? "Previous" : "Next"}
    >
        {useLucideIcon ? (
            config.direction === "left" ? (
                <ChevronLeft className="w-4 h-4 text-white" />
            ) : (
                <ChevronRight className="w-4 h-4 text-white" />
            )
        ) : (
            <img
                className={`w-[7.04px] h-[9.03px] ${config.direction === "left" ? "mr-0.5" : "ml-0.5"}`}
                alt=""
                src={config.polygon}
            />
        )}
    </button>
  );
};

