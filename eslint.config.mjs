// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import storybook from "eslint-plugin-storybook";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "no-unknown-property": "off",
      "@typescript-eslint/no-unknown-property": "off",
      "react/no-unknown-property": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],
      "react/prop-types": "off",
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Node built-ins
            "external", // npm packages
            "internal", // aliases como @/*
            ["parent", "sibling", "index"],
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "./*.css",
              group: "index",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          warnOnUnassignedImports: true,
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*", "./*"],
              message:
                "Usá el alias '@/...' en lugar de imports relativos. Esto mantiene el orden y la claridad del código.",
            },
          ],
        },
      ],
      "react/react-in-jsx-scope": "off",
      "react/function-component-definition": ["error"],
      "react-hooks/set-state-in-effect": "off",
    }
  },
  ...storybook.configs["flat/recommended"]
]);

export default eslintConfig;
