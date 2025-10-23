import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable or adjust specific rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      "@typescript-eslint/no-explicit-any": "warn", // Change to warn instead of error
      "react-hooks/exhaustive-deps": "warn", // Change to warn for deployment
      "no-var": "error", // Keep as error but you can change to "warn" if needed
      
      // Additional helpful rules
      "@typescript-eslint/no-unused-vars": "off", // Or set to "warn" for less strict
    }
  },
  {
    // Apply different rules for specific files or directories
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    }
  },
  {
    files: ["src/lib/actions/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off" // Disable for specific directory
    }
  }
];

export default eslintConfig;