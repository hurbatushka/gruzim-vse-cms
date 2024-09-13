import type { Config } from "tailwindcss";

const config: Config = {
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
        'transparent': 'transparent',
        'current-black': '#dbc58',
        'current-light': '#dbc58',
        'white': '#ffffff',
        'background-white': '#f3f4f6',
        'background-light-grey': '#FAFAFA',
      },
    },
  },
  plugins: [],
};
export default config;
