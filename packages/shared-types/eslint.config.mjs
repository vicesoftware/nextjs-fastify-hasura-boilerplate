import { config } from "@repo/eslint-config/base";

export default [
  ...config,
  {
    ignores: ["dist/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: "./tsconfig.json",
      },
    },
  },
];
