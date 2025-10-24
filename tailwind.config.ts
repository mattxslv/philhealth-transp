import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#009a3d",
          50: "#e6f7ed",
          100: "#ccefdb",
          200: "#99dfb7",
          300: "#66cf93",
          400: "#33bf6f",
          500: "#009a3d",
          600: "#007b31",
          700: "#005c25",
          800: "#003e19",
          900: "#001f0c",
        },
        secondary: {
          DEFAULT: "#2e2e2e",
          50: "#f5f5f5",
          100: "#e0e0e0",
          200: "#bdbdbd",
          300: "#9e9e9e",
          400: "#757575",
          500: "#2e2e2e",
          600: "#252525",
          700: "#1c1c1c",
          800: "#141414",
          900: "#0a0a0a",
        },
        accent: {
          DEFAULT: "#f4f4f4",
          50: "#ffffff",
          100: "#fefefe",
          200: "#fcfcfc",
          300: "#fafafa",
          400: "#f7f7f7",
          500: "#f4f4f4",
          600: "#c3c3c3",
          700: "#929292",
          800: "#616161",
          900: "#303030",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
