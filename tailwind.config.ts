import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { navy: "#0B3A5B", orange: "#E8742C", gold: "#C9A24B", cream: "#FAF6F0" },
      fontFamily: { serif: ["Georgia", "Times New Roman", "serif"] },
    },
  },
  plugins: [],
};
export default config;
