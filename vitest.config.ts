import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Vitest config — runs unit tests against pure TypeScript modules
 * (registry, design tokens, i18n helpers). React-component testing
 * comes later when we add Storybook + Playwright in FAZ 2F.
 */
export default defineConfig({
  resolve: {
    alias: {
      // Mirrors Next.js `@/...` alias from tsconfig.json paths.
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
    include: ["**/__tests__/**/*.test.{ts,tsx}", "**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "dist"],
    globals: false,
    reporters: ["default"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["lib/**/*.ts"],
      exclude: ["**/*.test.ts", "**/types.ts"],
    },
  },
});
