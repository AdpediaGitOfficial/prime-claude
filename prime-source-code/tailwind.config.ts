import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lime: "#e1ff83",
        dark: "#0e0e0e",
        forest: "#00372f",
        sage: "#d9e1e0",
        gym: "#6cbe46",
        vendor: "#ec6824",
      },
      fontFamily: {
        "instrument-sans": ["var(--font-instrument-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
