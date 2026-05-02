import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright — Tests E2E (interfaz de usuario y seguridad)
 * Documentación: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",

  // Tiempo máximo por test
  timeout: 30 * 1000,
  expect: { timeout: 5000 },

  // Continuar con los demás tests si uno falla
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reportes
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
  ],

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  // Navegadores a probar
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox",  use: { ...devices["Desktop Firefox"] } },
    { name: "mobile",   use: { ...devices["Pixel 5"] } },
  ],

  // Levantar el servidor de Next.js antes de los tests
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});