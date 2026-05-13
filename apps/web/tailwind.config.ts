import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09090b",
        field: "#fafafa",
        line: "#e4e4e7",
        pine: "#111827",
        mint: "#ecfdf5",
        coral: "#f97316",
        amber: "#d97706",
        accent: "#2563eb",
        cyan: "#0891b2"
      },
      boxShadow: {
        panel: "0 24px 70px rgba(15, 23, 42, 0.08)",
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px rgba(15,23,42,0.18)"
      }
    }
  },
  plugins: []
};

export default config;
