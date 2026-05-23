import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.test.ts",
    "<rootDir>/src/**/__tests__/**/*.test.tsx",
    "<rootDir>/tests/unit/**/*.test.ts",
    "<rootDir>/tests/unit/**/*.test.tsx",
    "<rootDir>/tests/integration/**/*.test.ts",
  ],

  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/tests/e2e/",
    // K6 eliminado — borrar la carpeta tests/load/ manualmente
  ],

  // Permite que Jest procese paquetes ESM como lucide-react y uploadthing
  transformIgnorePatterns: [
    "/node_modules/(?!(lucide-react|@uploadthing|uploadthing)/)",
  ],

  collectCoverageFrom: [
    "src/core/**/*.ts",
    "src/actions/**/*.ts",
    "!src/**/*.d.ts",
  ],

  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
};

export default createJestConfig(config);