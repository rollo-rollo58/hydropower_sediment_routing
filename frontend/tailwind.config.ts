import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#122333",
        mist: "#ebf4f3",
        lake: "#087e8b",
        moss: "#2f625b",
        sunrise: "#e9ab53"
      }
    }
  },
  plugins: []
};

export default config;
