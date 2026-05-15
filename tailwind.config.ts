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
        // Cormorant Garamond as default display — traditional, romantic serif
        display: ["var(--font-display)", "Georgia", "serif"],
        // Legacy alias so existing components don't break
        serif: ["var(--font-display)", "Georgia", "serif"],

        /* Edition-aware aliases — resolve from --edition-display token
           which CSS scopes via [data-edition="..."] swap. Fallback chain
           includes a per-edition Google Font in case the variable is unset. */
        edition:           ["var(--edition-display)", "var(--font-display)", "Georgia", "serif"],
        "edition-body":    ["var(--edition-body)",    "var(--font-sans)",    "system-ui", "sans-serif"],
        "edition-signature": ["var(--edition-signature)", "var(--font-signature)", "cursive"],

        /* Direct font handles — useful when forcing a specific edition
           font on a slot regardless of active scope (e.g. landing chrome). */
        atelier:   ["var(--font-atelier)",   "Georgia", "serif"],
        mansion:   ["var(--font-mansion)",   "Georgia", "serif"],
        bodrum:    ["var(--font-bodrum)",    "Georgia", "serif"],
        aurora:    ["var(--font-aurora)",    "Georgia", "serif"],
        signature: ["var(--font-signature)", "cursive"],
      },
      spacing: {
        /* Editorial 8pt scale — keeps existing Tailwind defaults intact,
           adds named tokens for readability. Tailwind's default 1=4px so
           these are aliases not overrides. */
        "ed-1":  "4px",
        "ed-2":  "8px",
        "ed-3":  "12px",
        "ed-4":  "16px",
        "ed-6":  "24px",
        "ed-8":  "32px",
        "ed-12": "48px",
        "ed-16": "64px",
        "ed-24": "96px",
        "ed-32": "128px",
      },
      boxShadow: {
        /* Photo-blur shadow scale — soft, warm, editorial */
        "ed-sm": "0 2px 8px rgba(31, 27, 23, 0.06)",
        "ed-md": "0 8px 24px -8px rgba(31, 27, 23, 0.10)",
        "ed-lg": "0 24px 50px -16px rgba(31, 27, 23, 0.18)",
        "ed-xl": "0 40px 90px -28px rgba(31, 27, 23, 0.28)",
      },
      transitionDuration: {
        "ed-micro": "150ms",
        "ed-short": "300ms",
        "ed-base":  "600ms",
        "ed-long":  "1200ms",
      },
      transitionTimingFunction: {
        silk:   "cubic-bezier(0.22, 1, 0.36, 1)",
        vellum: "cubic-bezier(0.16, 1, 0.30, 1)",
        snap:   "cubic-bezier(0.40, 0.00, 0.20, 1)",
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
        /* Editorial scale — used on edition slots (cover plates, RSVP cards) */
        "ed-sm":  "3px",
        "ed-md":  "6px",
        "ed-lg":  "12px",
        "ed-xl":  "20px",
        "ed-2xl": "32px",
        "ed-pill": "9999px",
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
