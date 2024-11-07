import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-plugin-prettier";
import _tseslint from "@typescript-eslint/eslint-plugin";
import _tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist"],
  },
  {
    files: ["**/*.{ts,tsx,js}", ".ts", ".tsx", ".js"],
    languageOptions: {
      ecmaVersion: 2020,
      parser: _tsParser,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": _tseslint,
      prettier: prettier,
    },
    rules: {
      // JS recommended rules
      ...js.configs.recommended.rules,

      // TypeScript recommended rules
      ..._tseslint.configs.recommended.rules,

      // React Hooks rules
      ...reactHooks.configs.recommended.rules,

      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Core ESLint rules
      "no-unused-vars": "warn",
      "no-console": "off", // Allow console statements

      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // Allow 'any' type in TypeScript
      "@typescript-eslint/no-explicit-any": "off",

      // Prettier integration for code formatting
      "prettier/prettier": "warn",
    },
  },
];
