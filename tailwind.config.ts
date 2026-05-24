import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        surface: {
          DEFAULT: "var(--color-surface)",
          elevated: "var(--color-surface-elevated)"
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)"
        },
        primary: {
          DEFAULT: "var(--color-text-primary)",
          muted: "var(--color-text-muted)"
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          soft: "var(--color-accent-soft)",
          foreground: "var(--color-accent-foreground)"
        },
        brand: {
          gold: "var(--color-brand-gold)",
          "gold-deep": "var(--color-brand-gold-deep)"
        },
        ivory: {
          DEFAULT: "#FAF6F0",
          50: "#FDFBF7",
          100: "#FAF6F0",
          200: "#F3EDE0",
          300: "#EADFC8"
        },
        ink: {
          DEFAULT: "#16120A",
          soft: "#3D372A",
          muted: "#7A7160",
          mute: "#A89F8C"
        },
        navy: {
          DEFAULT: "#131C32",
          soft: "#1E2942",
          deep: "#0B1124"
        },
        gold: {
          DEFAULT: "#C49A18",
          deep: "#8F6E0C",
          light: "#D4AF3A",
          glow: "#E8C547"
        },
        line: {
          DEFAULT: "#E8DFCC",
          strong: "#D7CBB2",
          dark: "rgba(232, 223, 204, 0.16)"
        }
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)"
      },
      letterSpacing: {
        display: "-0.03em",
        wordmark: "-0.028em"
      },
      backgroundImage: {
        grid: "var(--bg-grid)"
      },
      maxWidth: {
        content: "1120px"
      }
    }
  },
  plugins: []
};

export default config;
