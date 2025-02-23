import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography"

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "",
        secondary: "",
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
              color: theme("colors.neutral.800"),
              backgroundColor: theme("colors.neutral.200"),
              fontWeight: "700",
              padding: "0",
              borderRadius: "0",
            },
            pre: {
              backgroundColor: theme("colors.neutral.200"),
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
              color: theme("colors.neutral.900"),
              "&:first-child": { marginTop: "0" },
              "&:last-child": { marginBottom: "0" },
            },
            h2: {
              marginTop: "1.0em",
              marginBottom: "0.5em",
              color: theme("colors.neutral.900"),
              "&:first-child": { marginTop: "0" },
              "&:last-child": { marginBottom: "0" },
            },
            h3: {
              marginTop: "1.0em",
              marginBottom: "0.5em",
              color: theme("colors.neutral.900"),
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
              backgroundColor: theme("colors.neutral.900"),
              fontWeight: "700",
              padding: "0.1em 0",
              borderRadius: "0.25rem",
            },
            "pre > code": { // Code blocks (triple backticks)
              color: theme("colors.neutral.200"),
              backgroundColor: theme("colors.neutral.700"),
              fontWeight: "700",
              padding: "0",
              borderRadius: "0",
            },
            pre: {
              backgroundColor: theme("colors.neutral.700"),
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
    },
  },
  plugins: [typography],
};
export default config;
