import { generateRecommendationPlan } from "@/core/engines/recommendation-engine";
import { getCatalogoProducts, createProduct, deleteProduct } from "@/actions/catalogo-actions";

// ── Mocks elevados a la raíz del archivo ──────────────────────────────
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn()
}));

jest.mock("@/lib/db/index", () => {
  // Creamos un builder mock que soporta encadenamiento
  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(), // CORREGIDO: ahora encadena
    orderBy: jest.fn().mockReturnThis(), // CORREGIDO: ahora encadena
    leftJoin: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([{ id: 1, name: "Test" }]),
    // Magia para Drizzle: al agregar "then", convertimos el objeto en un Promise.
    // Así, cuando haces "await db.select()...", resuelve a un array vacío []
    // y el .map() de tu código real deja de fallar.
    then: jest.fn((resolve) => resolve([])),
  };

  return {
    db: {
      select: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue(mockQueryBuilder),
      }),
      insert: jest.fn().mockReturnValue(mockQueryBuilder),
      update: jest.fn().mockReturnValue(mockQueryBuilder),
      delete: jest.fn().mockReturnValue(mockQueryBuilder),
    },
  };
});

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

describe("Pruebas de Base de Datos — catálogo actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getCatalogoProducts retorna array vacío si no hay productos", async () => {
    const result = await getCatalogoProducts();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });

  it("createProduct retorna success: true al crear", async () => {
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
    const result = await deleteProduct(1);
    expect(result.success).toBe(true);
  });
});