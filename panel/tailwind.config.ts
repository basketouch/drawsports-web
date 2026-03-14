import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        drawsports: {
          primary: "#1a365d",
          accent: "#3182ce",
          light: "#ebf8ff",
        },
      },
    },
  },
  plugins: [],
};

export default config;
