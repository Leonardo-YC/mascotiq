import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Apunta al directorio raíz de tu app Next.js
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",

  // Orden en que se ejecutan los archivos de setup (CORREGIDO)
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Aliases de @/ que usa el proyecto
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Dónde buscar tests
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.test.ts",
    "<rootDir>/src/**/__tests__/**/*.test.tsx",
    "<rootDir>/tests/unit/**/*.test.ts",
    "<rootDir>/tests/unit/**/*.test.tsx",
    "<rootDir>/tests/integration/**/*.test.ts",
  ],

  // Ignorar
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/tests/e2e/",     // Playwright se encarga de estos
    "<rootDir>/tests/load/",    // k6 se encarga de estos
  ],

  // Reporte de cobertura
  collectCoverageFrom: [
    "src/core/**/*.ts",
    "src/actions/**/*.ts",
    "src/components/**/*.tsx",
    "!src/**/*.d.ts",
  ],

  // Umbrales mínimos de cobertura (ajusta según avance el proyecto)
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
};

export default createJestConfig(config);