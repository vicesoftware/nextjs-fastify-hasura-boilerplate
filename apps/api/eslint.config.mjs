import { config as baseConfig } from "@repo/eslint-config/base";

export default [
  ...baseConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [
      "eslint.config.mjs",
      "dist/**",
      "**/*.js",
      "**/*.d.ts",
      "**/*.js.map",
      "**/*.d.ts.map",
    ],
  },
];
