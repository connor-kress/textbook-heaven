import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme("colors.neutral.700"),
            code: { // Inline code (single backticks)
              color: theme("colors.neutral.900"),
              backgroundColor: theme("colors.neutral.100"),
              fontWeight: "700",
              padding: "0.1em 0",
              borderRadius: "0.25rem",
            },
            "pre > code": { // Code blocks (triple backticks)
              color: theme("colors.neutral.700"),
              backgroundColor: theme("colors.gray.200"),
              fontWeight: "700",
              padding: "0",
              borderRadius: "0",
            },
            pre: {
              backgroundColor: theme("colors.gray.200"),
              marginTop: "0.5em",
              marginBottom: "0.5em",
            },
            strong: {
              color: theme("colors.neutral.900"),
              fontWeight: "700",
            },
            p: {
              marginTop: "0.5em",
              marginBottom: "0.5em",
              "&:first-child": { marginTop: "0" },
              "&:last-child": { marginBottom: "0" },
            },
            h1: {
              marginTop: "1.0em",
              marginBottom: "0.5em",
              color: theme("colors.neutral.700"),
              "&:first-child": { marginTop: "0" },
              "&:last-child": { marginBottom: "0" },
            },
            h2: {
              marginTop: "1.0em",
              marginBottom: "0.5em",
              color: theme("colors.neutral.700"),
              "&:first-child": { marginTop: "0" },
              "&:last-child": { marginBottom: "0" },
            },
            h3: {
              marginTop: "1.0em",
              marginBottom: "0.5em",
              color: theme("colors.neutral.700"),
              "&:first-child": { marginTop: "0" },
              "&:last-child": { marginBottom: "0" },
            },
            a: { color: theme("colors.blue.600") },
          },
        },
        dark: {
          css: {
            color: theme("colors.neutral.300"),
            code: { // Inline code (single backticks)
              color: theme("colors.neutral.100"),
              backgroundColor: theme("colors.neutral.950"),
              fontWeight: "700",
              padding: "0.1em 0",
              borderRadius: "0.25rem",
            },
            "pre > code": { // Code blocks (triple backticks)
              color: theme("colors.neutral.200"),
              backgroundColor: theme("colors.neutral.800"),
              fontWeight: "700",
              padding: "0",
              borderRadius: "0",
            },
            pre: {
              backgroundColor: theme("colors.neutral.800"),
              marginTop: "0.5em",
              marginBottom: "0.5em",
            },
            strong: {
              color: theme("colors.neutral.100"),
              fontWeight: "700",
            },
            p: {
              marginTop: "0.5em",
              marginBottom: "0.5em",
              "&:first-child": { marginTop: "0" },
              "&:last-child": { marginBottom: "0" },
            },
            h1: {
              marginTop: "1.0em",
              marginBottom: "0.5em",
              color: theme("colors.neutral.100"),
              "&:first-child": { marginTop: "0" },
              "&:last-child": { marginBottom: "0" },
            },
            h2: {
              marginTop: "1.0em",
              marginBottom: "0.5em",
              color: theme("colors.neutral.100"),
              "&:first-child": { marginTop: "0" },
              "&:last-child": { marginBottom: "0" },
            },
            h3: {
              marginTop: "1.0em",
              marginBottom: "0.5em",
              color: theme("colors.neutral.100"),
              "&:first-child": { marginTop: "0" },
              "&:last-child": { marginBottom: "0" },
            },
            a: { color: theme("colors.blue.400") },
          },
        },
      }),
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [typography, require("tailwindcss-animate")],
};

export default config;
