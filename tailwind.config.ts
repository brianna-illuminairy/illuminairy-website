import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0D12",
        graphite: "#171B26",
        cloud: "#F8FAFC",
        mist: "#EEF2F7",
        line: "#E3E8F0",
        slatecopy: "#475569",
        indigo: "#4F46E5",
        electric: "#5B7CFF",
        violet: "#8B5CF6"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(15, 23, 42, 0.10)",
        ringed: "0 0 0 1px rgba(79, 70, 229, 0.12), 0 20px 60px rgba(11, 13, 18, 0.08)"
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(79, 70, 229, 0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(79, 70, 229, 0.10) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
