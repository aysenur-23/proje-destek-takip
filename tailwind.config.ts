import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-jakarta)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono:    ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
        premium: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "xs":      "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        "brand":   "0 4px 14px 0 rgb(37 99 235 / 0.25)",
        "premium": "0 4px 14px 0 rgb(124 58 237 / 0.25)",
        "card":    "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        "card-hover": "0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.04)",
        "glow-blue":   "0 0 40px rgb(37 99 235 / 0.2)",
        "glow-violet": "0 0 40px rgb(124 58 237 / 0.2)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh":
          "radial-gradient(ellipse 80% 60% at 20% 20%, rgb(37 99 235 / 0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgb(124 58 237 / 0.12) 0%, transparent 60%)",
        "dot-grid":
          "radial-gradient(circle, rgb(148 163 184 / 0.35) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-grid": "28px 28px",
      },
      animation: {
        "fade-in":    "fadeIn 0.5s ease-out both",
        "slide-up":   "slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-in":   "scaleIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both",
        "float":      "float 4s ease-in-out infinite",
        "shimmer":    "shimmer 2s linear infinite",
        "marquee":    "marquee 30s linear infinite",
        "spin-slow":  "spin 8s linear infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:   { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        scaleIn:   { from: { opacity: "0", transform: "scale(0.94)" }, to: { opacity: "1", transform: "scale(1)" } },
        float:     { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        shimmer:   { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        marquee:   { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        pulseSoft: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.6" } },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
