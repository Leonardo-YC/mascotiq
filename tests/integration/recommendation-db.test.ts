/**
 * PRUEBAS DE FUNCIONALIDAD — Motor de Recomendación
 * src/core/engines/__tests__/recommendation-engine.test.ts
 */

import { generateRecommendationPlan } from "@/core/engines/recommendation-engine";

describe("Motor de Recomendación — generateRecommendationPlan()", () => {

  it("gato senior → Plan Senior Gato", () => {
    const result = generateRecommendationPlan({ species: "cat", lifeStage: "senior", weightKg: 4, healthConditions: [] });
    expect(result.exactPlanName).toBe("Plan Senior Gato");
    expect(result.isEligibleForSubscription).toBe(true);
  });

  it("perro senior < 10 kg → Plan Senior Perro Pequeño", () => {
    const result = generateRecommendationPlan({ species: "dog", lifeStage: "senior", weightKg: 5, healthConditions: [] });
    expect(result.exactPlanName).toBe("Plan Senior Perro Pequeño");
  });

  it("perro senior 15 kg → Plan Senior Perro Mediano", () => {
    const result = generateRecommendationPlan({ species: "dog", lifeStage: "senior", weightKg: 15, healthConditions: [] });
    expect(result.exactPlanName).toBe("Plan Senior Perro Mediano");
  });

  it("perro senior 35 kg → Plan Senior Perro Grande", () => {
    const result = generateRecommendationPlan({ species: "dog", lifeStage: "senior", weightKg: 35, healthConditions: [] });
    expect(result.exactPlanName).toBe("Plan Senior Perro Grande");
  });

  it("perro senior 60 kg → Plan Senior Perro Gigante", () => {
    const result = generateRecommendationPlan({ species: "dog", lifeStage: "senior", weightKg: 60, healthConditions: [] });
    expect(result.exactPlanName).toBe("Plan Senior Perro Gigante");
  });

  it("mascota adulta → no elegible para suscripción", () => {
    const result = generateRecommendationPlan({ species: "dog", lifeStage: "adult", weightKg: 15, healthConditions: [] });
    expect(result.isEligibleForSubscription).toBe(false);
    expect(result.exactPlanName).toBeNull();
  });

  it("condición digestiva añade categoría Salud Digestiva", () => {
    const result = generateRecommendationPlan({ species: "dog", lifeStage: "senior", weightKg: 15, healthConditions: ["digestion"] });
    expect(result.categories).toContain("Salud Digestiva");
  });

  it("condición skin añade categoría de piel y pelaje", () => {
    const result = generateRecommendationPlan({ species: "dog", lifeStage: "senior", weightKg: 15, healthConditions: ["skin"] });
    expect(result.categories).toContain("Cuidado Dermatológico y Pelaje");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
/**
 * PRUEBAS DE BASE DE DATOS (con mocks de Drizzle)
 * tests/integration/database.test.ts
 */

// Mock del cliente de BD
jest.mock("@/lib/db/index", () => ({
  db: {
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([]),
          orderBy: jest.fn().mockResolvedValue([]),
        }),
        orderBy: jest.fn().mockResolvedValue([]),
        leftJoin: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    }),
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([{ id: 1, name: "Test" }]),
      }),
    }),
    update: jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([]),
      }),
    }),
    delete: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue([]),
    }),
  },
}));

describe("Pruebas de Base de Datos — catálogo actions", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getCatalogoProducts retorna array vacío si no hay productos", async () => {
    const { getCatalogoProducts } = await import("@/actions/catalogo-actions");
    const result = await getCatalogoProducts();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });

  it("createProduct retorna success: true al crear", async () => {
    const { createProduct } = await import("@/actions/catalogo-actions");
    const formData = new FormData();
    formData.append("name", "Test Suplemento");
    formData.append("price", "100.00");
    formData.append("subscriptionPrice", "80.00");
    formData.append("description", "Test descripción");
    formData.append("categoryId", "1");

    const result = await createProduct(formData, [1]);
    expect(result.success).toBe(true);
  });

  it("deleteProduct retorna success: true al eliminar", async () => {
    const { deleteProduct } = await import("@/actions/catalogo-actions");
    const result = await deleteProduct(1);
    expect(result.success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
/**
 * PRUEBAS DE RECUPERACIÓN ANTE FALLOS
 * tests/unit/error-handling.test.ts
 */

describe("Pruebas de Recuperación ante Fallos", () => {

  it("getCatalogoProducts maneja error de BD y retorna success: false", async () => {
    // Simular fallo de conexión
    const { db } = await import("@/lib/db/index");
    (db.select as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Connection refused");
    });

    const { getCatalogoProducts } = await import("@/actions/catalogo-actions");
    const result = await getCatalogoProducts();
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("calculateSeniority no lanza excepciones con valores extremos", async () => {
    const { calculateSeniority } = await import("@/core/engines/seniority-engine");
    expect(() => calculateSeniority({ species: "dog", weightKg: 0, ageYears: 0 })).not.toThrow();
    expect(() => calculateSeniority({ species: "cat", weightKg: 100, ageYears: 50 })).not.toThrow();
  });
});