"use server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "../lib/db/index";
import { pets, users, plans } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { quizSchema, QuizFormData } from "../core/validators/quiz-schema";
import { calculateSeniority } from "../core/engines/seniority-engine";
import { generateRecommendationPlan } from "../core/engines/recommendation-engine";

// Acción 1: Para usuarios LOGUEADOS — Guarda en BD
// FIX: ahora recibe photoUrl como segundo parámetro opcional
export async function processQuizSubmission(data: QuizFormData, photoUrl?: string) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return { success: false, error: "Debes iniciar sesión para procesar el diagnóstico." };
    }

    const userId = user.id;

    // Upsert del usuario en nuestra BD (podría ya existir por el webhook de Clerk)
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (existingUser.length === 0) {
      const email = user.emailAddresses[0]?.emailAddress || `user_${userId}@mascotiq.com`;
      const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Usuario Mascotiq";
      await db.insert(users).values({ id: userId, email, name });
    }

    const parsedData = quizSchema.parse(data);

    const lifeStage = calculateSeniority({
      species: parsedData.species,
      weightKg: parsedData.weightKg,
      ageYears: parsedData.ageYears,
    });

    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - parsedData.ageYears);

    // FIX: ahora guardamos photoUrl si viene
    const [newPet] = await db
      .insert(pets)
      .values({
        userId,
        name: parsedData.name,
        species: parsedData.species,
        breed: parsedData.breed || null,
        isMixed: parsedData.isMixed,
        weightKg: parsedData.weightKg.toString(),
        birthDate,
        lifeStage,
        photoUrl: photoUrl || null, // ← guardamos la foto
      })
      .returning();

    const recommendation = generateRecommendationPlan({
      species: parsedData.species,
      lifeStage,
      healthConditions: parsedData.healthConditions,
      weightKg: parsedData.weightKg,
    });

    let stripePriceId = null;
    let planId = null;
    if (recommendation.exactPlanName) {
      const matchedPlan = await db
        .select()
        .from(plans)
        .where(eq(plans.name, recommendation.exactPlanName))
        .limit(1);
      if (matchedPlan.length > 0) {
        stripePriceId = matchedPlan[0].stripePriceId;
        planId = matchedPlan[0].id;
      }
    }

    return {
      success: true,
      pet: newPet,
      recommendation: {
        ...recommendation,
        stripePriceId,
        planId,
      },
    };
  } catch (error) {
    console.error("Error al procesar el Quiz:", error);
    return { success: false, error: "Error interno procesando la información de tu mascota." };
  }
}

// Acción 2: Para VISITANTES — Solo calcula, NO guarda en BD
export async function getPublicRecommendation(data: QuizFormData) {
  try {
    const parsedData = quizSchema.parse(data);

    const lifeStage = calculateSeniority({
      species: parsedData.species,
      weightKg: parsedData.weightKg,
      ageYears: parsedData.ageYears,
    });

    const recommendation = generateRecommendationPlan({
      species: parsedData.species,
      lifeStage,
      healthConditions: parsedData.healthConditions,
      weightKg: parsedData.weightKg,
    });

    let stripePriceId = null;
    let planId = null;
    if (recommendation.exactPlanName) {
      const matchedPlan = await db
        .select()
        .from(plans)
        .where(eq(plans.name, recommendation.exactPlanName))
        .limit(1);
      if (matchedPlan.length > 0) {
        stripePriceId = matchedPlan[0].stripePriceId;
        planId = matchedPlan[0].id;
      }
    }

    return {
      success: true,
      recommendation: {
        ...recommendation,
        stripePriceId,
        planId,
      },
      // Devolvemos la fecha calculada para el flujo de lead de mascota joven
      calculatedBirthDate: new Date(
        new Date().setFullYear(new Date().getFullYear() - parsedData.ageYears)
      ).toISOString(),
    };
  } catch (error) {
    console.error("Error en recomendación pública:", error);
    return { success: false, error: "Error procesando el diagnóstico. Verifica los datos ingresados." };
  }
}