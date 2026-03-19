import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface SectionHeaderProps {
  title: string;
  variant?: "light" | "dark";
  className?: string;
}

export const SectionHeader = ({ 
  title,
  variant = "light",
  className,
}: SectionHeaderProps): React.JSX.Element => {
  const isDark = variant === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center gap-4 w-full px-4 mb-8",
        className
      )}
    >
      <div className={cn(
        "w-32 h-1.5 rounded-full",
        isDark ? "bg-white/30" : "bg-red-100"
      )} />
      
      <h2 
        className={cn(
          "font-tilt-warp text-4xl md:text-5xl tracking-tight text-center uppercase",
          isDark 
            ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" 
            : "text-red-600 drop-shadow-sm"
        )}
      >
        {title}
      </h2>

      <div className={cn(
        "w-16 h-1 rounded-full",
        isDark ? "bg-white/20" : "bg-red-50"
      )} />
    </motion.div>
  );
};

