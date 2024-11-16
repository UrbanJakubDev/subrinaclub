import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");
const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        brand: "#8D354E",
        "royal-gold": "#F5BD02",
        "chrome-silver": "#D8DBDE",
      },
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
    },

    plugins: [
      plugin(function ({ matchUtilities, theme }) {
        matchUtilities(
          {
            "text-shadow": (value) => ({
              textShadow: value,
            }),
          },
          { values: theme("textShadow") }
        );
      }),
    ],
  },
});
export default config;
