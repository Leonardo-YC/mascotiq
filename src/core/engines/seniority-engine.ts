export type LifeStage = 'puppy' | 'adult' | 'senior';

export interface SeniorityParams {
  species: 'dog' | 'cat';
  weightKg: number;
  ageYears: number;
}

export function calculateSeniority({ species, weightKg, ageYears }: SeniorityParams): LifeStage {
  // Cachorros de menos de 1 año
  if (ageYears < 1) return 'puppy';

  // Lógica para Gatos
  if (species === 'cat') {
    return ageYears >= 7 ? 'senior' : 'adult';
  }

  // Lógica para Perros (Depende del peso)
  if (species === 'dog') {
    if (weightKg < 10) {
      return ageYears >= 9 ? 'senior' : 'adult'; // Perros Pequeños
    } else if (weightKg < 25) {
      return ageYears >= 7 ? 'senior' : 'adult'; // Perros Medianos
    } else if (weightKg < 45) {
      return ageYears >= 6 ? 'senior' : 'adult'; // Perros Grandes
    } else {
      return ageYears >= 5 ? 'senior' : 'adult'; // Perros Gigantes
    }
  }

  return 'adult'; // Fallback por seguridad
}