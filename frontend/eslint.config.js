// eslint.config.js
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  // For Node.js v20.11.0 or adjust accordingly
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  // Convert legacy Next.js configs using FlatCompat
  ...compat.config({
    extends: [
      "next/core-web-vitals", // Next.js Core Web Vitals recommended rules
      "next/typescript", // Next.js TypeScript rules
    ],
    plugins: ["react", "react-hooks", "react-refresh", "prettier"],
    settings: {
      react: { version: "18.3" },
    },
    rules: {
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      "prettier/prettier": [
        "error",
        {
          printWidth: 120,
          endOfLine: "auto",
        },
      ],
    },
  }),
  // Apply language options and disable the rule for your source files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
];

export default eslintConfig;
