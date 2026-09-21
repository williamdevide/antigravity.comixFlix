import React from "react";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8 w-auto", compact = false }) => {
  if (compact) {
    return (
      <svg
        viewBox="0 0 45 45"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ComixFlix"
      >
        <defs>
          <linearGradient id="cf-grad-compact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E50914" />
            <stop offset="100%" stopColor="#B20710" />
          </linearGradient>
        </defs>
        <path d="M6 8L36 2L42 38L12 44Z" fill="url(#cf-grad-compact)" />
        <path d="M16 14L38 10L42 34L20 38Z" fill="#FFFFFF" fillOpacity="0.25" />
        <text
          x="19"
          y="31"
          fill="#FFFFFF"
          fontFamily="Inter, sans-serif"
          fontWeight="900"
          fontSize="22"
          fontStyle="italic"
        >
          C
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 240 50"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ComixFlix Logo"
    >
      <defs>
        <linearGradient id="cf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E50914" />
          <stop offset="100%" stopColor="#B20710" />
        </linearGradient>
      </defs>
      {/* Comic panel / dynamic polygon icon */}
      <path d="M6 10L24 6L28 38L10 42Z" fill="url(#cf-grad)" />
      <path d="M14 16L32 12L36 34L18 38Z" fill="#FFFFFF" fillOpacity="0.25" />
      <text
        x="17"
        y="29"
        fill="#FFFFFF"
        fontFamily="Inter, sans-serif"
        fontWeight="900"
        fontSize="18"
        fontStyle="italic"
      >
        C
      </text>
      {/* Wordmark COMIXFLIX */}
      <text
        x="44"
        y="34"
        fill="#E50914"
        fontFamily="Inter, sans-serif"
        fontWeight="900"
        fontSize="25"
        letterSpacing="-0.5"
      >
        COMIX
      </text>
      <text
        x="136"
        y="34"
        className="fill-white dark:fill-white text-primary"
        fontFamily="Inter, sans-serif"
        fontWeight="800"
        fontSize="25"
        letterSpacing="-0.5"
      >
        FLIX
      </text>
    </svg>
  );
};
