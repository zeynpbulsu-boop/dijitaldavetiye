import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1320px" },
    },
    extend: {
      fontFamily: {
        // Inter Tight as default body
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        // Cormorant Garamond as display — traditional, romantic serif
        display: ["var(--font-display)", "Georgia", "serif"],
        // Legacy alias so existing components don't break
        serif: ["var(--font-display)", "Georgia", "serif"],
      },
      colors: {
        bg: "hsl(var(--bg))",
        "bg-alt": "hsl(var(--bg-alt))",
        ink: "hsl(var(--ink))",
        "ink-soft": "hsl(var(--ink-soft))",
        muted: "hsl(var(--muted))",
        line: "hsl(var(--line))",
        accent: {
          DEFAULT: "hsl(var(--accent))",
          deep: "hsl(var(--accent-deep))",
        },
        gold: "hsl(var(--gold))",
        sage: "hsl(var(--sage))",
        "sage-deep": "hsl(var(--sage-deep))",
        paper: "hsl(var(--paper))",
        // Brand namespace — direct HEX aliases for new sections.
        // Existing semantic tokens above stay untouched.
        brand: {
          cream: "#F2EEE6",
          "cream-alt": "#EFE6DA",
          ink: "#2B1E16",
          mute: "#7A6A5D",
          "rose-taupe": "#B98E78",
          cognac: "#8C5A3C",
        },
      },
      letterSpacing: {
        tightest: "-0.04em",
        editorial: "-0.025em",
      },
      borderRadius: {
        none: "0",
        sm: "2px",
        md: "6px",
        lg: "10px",
        xl: "14px",
        "2xl": "18px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
