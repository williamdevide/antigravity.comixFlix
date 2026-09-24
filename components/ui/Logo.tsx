import React from "react";
import { getAssetPath } from "@/lib/utils/asset";

interface LogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "hero";
  showText?: boolean;
  glow?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  showText = true,
  glow = false,
}) => {
  // Configurações de dimensão de acordo com o tamanho
  const sizeMap = {
    xs: { imageSize: 22, fontSize: "text-sm", spacing: "gap-1.5" },
    sm: { imageSize: 28, fontSize: "text-base", spacing: "gap-2" },
    md: { imageSize: 36, fontSize: "text-xl", spacing: "gap-2.5" },
    lg: { imageSize: 48, fontSize: "text-2xl", spacing: "gap-3" },
    xl: { imageSize: 64, fontSize: "text-3xl", spacing: "gap-3.5" },
    hero: { imageSize: 120, fontSize: "text-4xl sm:text-5xl", spacing: "gap-4 sm:gap-5" },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      className={`inline-flex items-center select-none ${currentSize.spacing} ${className}`}
    >
      {/* Imagem Oficial do Logo (logo.jpg) com acabamento premium e glow neon */}
      <div
        className={`relative shrink-0 flex items-center justify-center rounded-xl overflow-hidden transition-transform duration-300 border border-[#E50914]/40 shadow-md bg-black ${
          glow
            ? "drop-shadow-[0_0_25px_rgba(229,9,20,0.85)] shadow-[0_0_20px_rgba(229,9,20,0.5)] border-[#E50914]"
            : ""
        }`}
        style={{
          width: currentSize.imageSize,
          height: currentSize.imageSize,
        }}
      >
        <img
          src={getAssetPath("/branding/logo.jpg")}
          alt="ComixFlix Logo"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Glow neon sutil de sobreposição */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none" />
      </div>

      {/* Tipografia Oficial COMIXFLIX */}
      {showText && (
        <div className="flex items-center tracking-wider leading-none">
          <span
            className={`font-black text-[#E50914] ${currentSize.fontSize} drop-shadow-[0_2px_12px_rgba(229,9,20,0.6)]`}
          >
            COMIX
          </span>
          <span
            className={`font-black text-white ${currentSize.fontSize} drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] ml-0.5`}
          >
            FLIX
          </span>
        </div>
      )}
    </div>
  );
};
