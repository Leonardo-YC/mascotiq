import { LifeStage } from './seniority-engine';

export interface PetProfile {
  species: 'dog' | 'cat';
  lifeStage: LifeStage;
  healthConditions: string[];
  weightKg: number;
}

export function generateRecommendationPlan(profile: PetProfile) {
  const recommendedCategories = new Set<string>();
  let exactPlanName = null;

  // Lógica exacta para asignar 1 de los 5 planes
  if (profile.lifeStage === 'senior') {
    recommendedCategories.add('Senior Care');
    recommendedCategories.add('Salud Articular');
    
    if (profile.species === 'cat') {
      recommendedCategories.add('Salud Renal');
      exactPlanName = "Plan Senior Gato";
    } else {
      if (profile.weightKg < 10) exactPlanName = "Plan Senior Perro Pequeño";
      else if (profile.weightKg < 25) exactPlanName = "Plan Senior Perro Mediano";
      else if (profile.weightKg < 45) exactPlanName = "Plan Senior Perro Grande";
      else exactPlanName = "Plan Senior Perro Gigante";
    }
  }

  if (profile.healthConditions.includes('digestion')) recommendedCategories.add('Salud Digestiva');
  if (profile.healthConditions.includes('skin')) recommendedCategories.add('Cuidado Dermatológico y Pelaje');
  if (profile.healthConditions.includes('anxiety')) recommendedCategories.add('Soporte Cognitivo y Calma');

  if (recommendedCategories.size === 0) recommendedCategories.add('Bienestar General Preventivo');

  return {
    isEligibleForSubscription: profile.lifeStage === 'senior',
    exactPlanName, // <-- NUEVO: Retornamos el nombre exacto para buscarlo en DB
    categories: Array.from(recommendedCategories),
    message: profile.lifeStage === 'senior'
      ? 'Tu mascota ha entrado a su etapa Senior. Necesita un plan nutricional especializado para proteger sus órganos y articulaciones.'
      : '¡Tu mascota está en una excelente etapa de juventud! Te notificaremos exactamente cuándo se acerque a su etapa Senior para iniciar su cuidado preventivo.',
  };
}