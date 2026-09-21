import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary, #E50914)",
          "primary-hover": "#F40612",
          "primary-active": "#B20710",
        },
        bg: {
          canvas: "var(--bg-canvas, #141414)",
          surface: "var(--bg-surface, #1F1F1F)",
          elevated: "var(--bg-elevated, #2B2B2B)",
          "surface-light": "#FFFFFF",
          "canvas-light": "#F8F9FA",
        },
        text: {
          primary: "var(--text-primary, #FFFFFF)",
          secondary: "var(--text-secondary, #B3B3B3)",
          tertiary: "var(--text-tertiary, #8C8C8C)",
          "primary-dark": "#141414",
          "secondary-dark": "#4D4D4D",
        },
        border: {
          default: "var(--border-default, #404040)",
          subtle: "var(--border-subtle, #2A2A2A)",
          light: "#E2E8F0",
        },
        status: {
          success: "#46D369",
          warning: "#FFB400",
          error: "#FF5A63",
          info: "#4DA3FF",
          wishlist: "#E50914",
          collection: "#4DA3FF",
        },
        promo: "#FFB400",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      aspectRatio: {
        "2/3": "2 / 3",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      spacing: {
        margin: "1rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
      },
      boxShadow: {
        elevated: "0 8px 24px rgba(0, 0, 0, 0.4)",
        card: "0 4px 12px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
