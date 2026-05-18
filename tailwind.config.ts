import type { Config } from "tailwindcss";

const config: Config = {
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
        marigold: {
          DEFAULT: "#E09318",
          soft: "#F2B25A",
          ink: "#5A3A07"
        },
        sage: {
          DEFAULT: "#5F9E82",
          soft: "#8FBFA8",
          ink: "#1E3A2C"
        },
        terracotta: {
          DEFAULT: "#C4623E",
          soft: "#D98F70",
          ink: "#4A1F0F"
        },
        sky: {
          DEFAULT: "#5A8EB8",
          soft: "#8DB3D1",
          ink: "#1B2F45"
        },
        line: {
          DEFAULT: "#E8DFCC",
          strong: "#D7CBB2",
          dark: "rgba(232, 223, 204, 0.16)"
        }
      },
      boxShadow: {
        soft: "0 24px 80px rgba(22, 18, 10, 0.08)",
        editorial:
          "0 1px 0 rgba(22, 18, 10, 0.04), 0 30px 60px -20px rgba(22, 18, 10, 0.12)",
        gold:
          "0 0 0 1px rgba(196, 154, 24, 0.20), 0 24px 60px -24px rgba(143, 110, 12, 0.30)",
        navy: "0 30px 80px -30px rgba(11, 17, 36, 0.40)"
      },
      letterSpacing: {
        eyebrow: "0.14em",
        display: "-0.035em",
        wordmark: "-0.032em",
        wordmarkSm: "-0.012em"
      },
      backgroundImage: {
        "ivory-gradient":
          "linear-gradient(180deg, #FDFBF7 0%, #FAF6F0 60%, #F3EDE0 100%)",
        "navy-gradient":
          "linear-gradient(180deg, #131C32 0%, #0B1124 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #E8C547 0%, #C49A18 50%, #8F6E0C 100%)",
        "north-star":
          "radial-gradient(circle at 50% 50%, rgba(232,197,71,0.85), rgba(196,154,24,0.25) 45%, transparent 70%)",
        "paper-grain":
          "radial-gradient(circle at 20% 10%, rgba(196,154,24,0.05), transparent 40%), radial-gradient(circle at 85% 80%, rgba(196,154,24,0.04), transparent 45%)"
      }
    }
  },
  plugins: []
};

export default config;
