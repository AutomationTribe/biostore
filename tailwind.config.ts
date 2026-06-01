import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#ec4899",
        accent: "#f59e0b",
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
