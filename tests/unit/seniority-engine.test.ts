/**
 * PRUEBAS DE FUNCIONALIDAD — Motor de Senioridad Biológica
 * src/core/engines/__tests__/seniority-engine.test.ts
 *
 * Cubre: casos límite de clasificación por especie, peso y edad.
 */

import { calculateSeniority } from "@/core/engines/seniority-engine";

describe("Motor de Senioridad — calculateSeniority()", () => {

  // ── Cachorros ──────────────────────────────────────────────────────
  describe("Etapa Cachorro (puppy)", () => {
    it("perro de 0.5 años → puppy", () => {
      expect(calculateSeniority({ species: "dog", weightKg: 5, ageYears: 0.5 })).toBe("puppy");
    });
    it("gato de 0 años → puppy", () => {
      expect(calculateSeniority({ species: "cat", weightKg: 2, ageYears: 0 })).toBe("puppy");
    });
    it("perro de 0.9 años → puppy (límite inferior)", () => {
      expect(calculateSeniority({ species: "dog", weightKg: 20, ageYears: 0.9 })).toBe("puppy");
    });
  });

  // ── Gatos ──────────────────────────────────────────────────────────
  describe("Gatos", () => {
    it("gato de 6 años → adult", () => {
      expect(calculateSeniority({ species: "cat", weightKg: 4, ageYears: 6 })).toBe("adult");
    });
    it("gato de 7 años → senior (límite exacto)", () => {
      expect(calculateSeniority({ species: "cat", weightKg: 4, ageYears: 7 })).toBe("senior");
    });
    it("gato de 15 años → senior", () => {
      expect(calculateSeniority({ species: "cat", weightKg: 3, ageYears: 15 })).toBe("senior");
    });
  });

  // ── Perros Pequeños (< 10 kg) ───────────────────────────────────────
  describe("Perros Pequeños (< 10 kg)", () => {
    it("perro 5 kg, 8 años → adult", () => {
      expect(calculateSeniority({ species: "dog", weightKg: 5, ageYears: 8 })).toBe("adult");
    });
    it("perro 9.9 kg, 9 años → senior (límite exacto)", () => {
      expect(calculateSeniority({ species: "dog", weightKg: 9.9, ageYears: 9 })).toBe("senior");
    });
    it("chihuahua 2 kg, 12 años → senior", () => {
      expect(calculateSeniority({ species: "dog", weightKg: 2, ageYears: 12 })).toBe("senior");
    });
  });

  // ── Perros Medianos (10–25 kg) ──────────────────────────────────────
  describe("Perros Medianos (10–25 kg)", () => {
    it("perro 15 kg, 6 años → adult", () => {
      expect(calculateSeniority({ species: "dog", weightKg: 15, ageYears: 6 })).toBe("adult");
    });
    it("perro 10 kg, 7 años → senior (límite exacto)", () => {
      expect(calculateSeniority({ species: "dog", weightKg: 10, ageYears: 7 })).toBe("senior");
    });
    it("perro 24.9 kg, 8 años → senior", () => {
      expect(calculateSeniority({ species: "dog", weightKg: 24.9, ageYears: 8 })).toBe("senior");
    });
  });

  // ── Perros Grandes (25–45 kg) ───────────────────────────────────────
  describe("Perros Grandes (25–45 kg)", () => {
    it("perro 30 kg, 5 años → adult", () => {
      expect(calculateSeniority({ species: "dog", weightKg: 30, ageYears: 5 })).toBe("adult");
    });
    it("perro 25 kg, 6 años → senior (límite exacto)", () => {
      expect(calculateSeniority({ species: "dog", weightKg: 25, ageYears: 6 })).toBe("senior");
    });
    it("labrador 35 kg, 9 años → senior", () => {
      expect(calculateSeniority({ species: "dog", weightKg: 35, ageYears: 9 })).toBe("senior");
    });
  });

  // ── Perros Gigantes (> 45 kg) ───────────────────────────────────────
  describe("Perros Gigantes (> 45 kg)", () => {
    it("gran danés 60 kg, 4 años → adult", () => {
      expect(calculateSeniority({ species: "dog", weightKg: 60, ageYears: 4 })).toBe("adult");
    });
    it("perro 45.1 kg, 5 años → senior (límite exacto)", () => {
      expect(calculateSeniority({ species: "dog", weightKg: 45.1, ageYears: 5 })).toBe("senior");
    });
    it("perro 80 kg, 3 años → adult", () => {
      expect(calculateSeniority({ species: "dog", weightKg: 80, ageYears: 3 })).toBe("adult");
    });
  });
});