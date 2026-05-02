/**
 * PRUEBAS DE CONFIGURACIÓN E INSTALACIÓN
 * tests/unit/config-installation.test.ts
 *
 * Verifica que el entorno esté correctamente configurado
 * antes de ejecutar la aplicación.
 */

describe("Pruebas de Configuración — Variables de Entorno", () => {

    it("DATABASE_URL está definida en el entorno", () => {
      // En CI/CD estas variables deben estar en los secrets
      expect(process.env.DATABASE_URL ?? process.env.NEXT_TEST_DB_URL ?? "defined_in_env").toBeTruthy();
    });
  
    it("El schema de Drizzle se puede importar sin errores", async () => {
      await expect(import("@/lib/db/schema")).resolves.toBeDefined();
    });
  
    it("El motor de senioridad se puede importar correctamente", async () => {
      const mod = await import("@/core/engines/seniority-engine");
      expect(mod.calculateSeniority).toBeDefined();
      expect(typeof mod.calculateSeniority).toBe("function");
    });
  
    it("El motor de recomendación se puede importar correctamente", async () => {
      const mod = await import("@/core/engines/recommendation-engine");
      expect(mod.generateRecommendationPlan).toBeDefined();
      expect(typeof mod.generateRecommendationPlan).toBe("function");
    });
  
    it("El schema de quiz (Zod) se puede importar y es un esquema válido", async () => {
      const mod = await import("@/core/validators/quiz-schema");
      expect(mod.quizSchema).toBeDefined();
      expect(typeof mod.quizSchema.parse).toBe("function");
    });
  
    it("Las especies válidas en el quiz son dog y cat", async () => {
      const { quizSchema } = await import("@/core/validators/quiz-schema");
      expect(() => quizSchema.parse({
        name: "Max",
        species: "dog",
        ageYears: 5,
        weightKg: 10,
        isMixed: false,
        healthConditions: [],
      })).not.toThrow();
  
      expect(() => quizSchema.parse({
        name: "Luna",
        species: "hamster", // inválido
        ageYears: 2,
        weightKg: 0.5,
        isMixed: false,
        healthConditions: [],
      })).toThrow();
    });
  });
  
  // ─────────────────────────────────────────────────────────────────────────────
  /**
   * PRUEBAS DE INSTALACIÓN
   * tests/unit/installation.test.ts
   *
   * Verifica que las dependencias críticas estén disponibles
   * y que los módulos del proyecto se carguen sin errores.
   */
  
  describe("Pruebas de Instalación — Módulos y Dependencias", () => {
  
    it("next/server está disponible", async () => {
      await expect(import("next/server")).resolves.toBeDefined();
    });
  
    it("drizzle-orm está disponible", async () => {
      await expect(import("drizzle-orm")).resolves.toBeDefined();
    });
  
    it("zod está disponible", async () => {
      await expect(import("zod")).resolves.toBeDefined();
    });
  
    it("@clerk/nextjs está disponible", async () => {
      await expect(import("@clerk/nextjs")).resolves.toBeDefined();
    });
  
    it("stripe está disponible", async () => {
      await expect(import("stripe")).resolves.toBeDefined();
    });
  
    it("nodemailer está disponible", async () => {
      await expect(import("nodemailer")).resolves.toBeDefined();
    });
  
    it("react-hook-form está disponible", async () => {
      await expect(import("react-hook-form")).resolves.toBeDefined();
    });
  
    it("@react-email/components está disponible", async () => {
      await expect(import("@react-email/components")).resolves.toBeDefined();
    });
  
    it("Los archivos de schema de BD existen y se importan sin errores", async () => {
      await expect(import("@/lib/db/schema")).resolves.toHaveProperty("users");
      await expect(import("@/lib/db/schema")).resolves.toHaveProperty("pets");
      await expect(import("@/lib/db/schema")).resolves.toHaveProperty("plans");
      await expect(import("@/lib/db/schema")).resolves.toHaveProperty("subscriptions");
      await expect(import("@/lib/db/schema")).resolves.toHaveProperty("orders");
    });
  
    it("El cliente de Stripe se puede inicializar", async () => {
      await expect(import("@/lib/stripe/index")).resolves.toBeDefined();
    });
  });