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
          DEFAULT: "#407C55",
          50: "#E9F3ED",
          100: "#D3E7DB",
          200: "#A7CFB7",
          300: "#7BB793",
          400: "#4F9F6F",
          500: "#407C55",
          600: "#336344",
          700: "#264A33",
          800: "#1A3122",
          900: "#0D1911",
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
          DEFAULT: "#FFD700",
          50: "#FFFEF5",
          100: "#FFFBEB",
          200: "#FFF6CC",
          300: "#FFF0AD",
          400: "#FFEB8E",
          500: "#FFD700",
          600: "#E6C200",
          700: "#CCAD00",
          800: "#B39900",
          900: "#998500",
        },
        yellow: {
          DEFAULT: "#FFD700",
          50: "#FFFEF5",
          100: "#FFFBEB",
          200: "#FFF6CC",
          300: "#FFF0AD",
          400: "#FFEB8E",
          500: "#FFD700",
          600: "#E6C200",
          700: "#CCAD00",
          800: "#B39900",
          900: "#998500",
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
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
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
