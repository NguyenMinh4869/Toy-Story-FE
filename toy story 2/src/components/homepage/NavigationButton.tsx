import React from "react";

export interface NavigationButtonConfig {
  top: string;
  left: string;
  polygon: string;
  direction: "left" | "right";
  onClick?: () => void;
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

  return (
    <button
      onClick={handleClick}
      className="w-[33px] h-[31px] rounded-[16.5px/15.5px] border border-solid border-white bg-[linear-gradient(180deg,rgba(227,184,103,1)_0%,rgba(220,199,160,1)_100%)] absolute flex"
      style={{ top: config.top, left: config.left }}
      aria-label={config.direction === "left" ? "Previous" : "Next"}
    >
      <img
        className={`mt-[11.5px] w-[7.04px] h-[9.03px] ${config.direction === "left" ? "ml-[11.8px]" : "ml-[13.2px]"}`}
        alt=""
        src={config.polygon}
      />
    </button>
  );
};

