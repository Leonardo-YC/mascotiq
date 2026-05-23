"use server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db/index";
import { pets, subscriptions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { calculateSeniority, LifeStage } from "@/core/engines/seniority-engine";

interface PetUpdateFields {
  name?: string;
  weightKg?: string;
  photoUrl?: string | null;
  breed?: string | null;
  isMixed?: boolean;
  birthDate?: Date;
  lifeStage?: LifeStage;
}

export async function deletePet(petId: number) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("No autorizado");

    const activeSubs = await db
      .select()
      .from(subscriptions)
      .where(and(eq(subscriptions.petId, petId), eq(subscriptions.status, "active")));

    if (activeSubs.length > 0) {
      return {
        success: false,
        errorType: "ACTIVE_SUBSCRIPTION",
        error:
          "Esta mascota tiene una suscripción activa. Cancela la suscripción desde el Portal de Stripe antes de eliminar su perfil.",
      };
    }

    const allSubs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.petId, petId));

    if (allSubs.length > 0) {
      await db.delete(subscriptions).where(eq(subscriptions.petId, petId));
    }

    await db.delete(pets).where(
      and(eq(pets.id, petId), eq(pets.userId, user.id))
    );
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error al eliminar mascota:", error);
    return { success: false, error: "No se pudo eliminar el perfil." };
  }
}

export async function updatePet(
  petId: number,
  data: {
    name: string;
    weightKg: number;
    photoUrl?: string;
    breed?: string;
    isMixed?: boolean;
    ageYears?: number;
  }
) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("No autorizado");

    const updateFields: PetUpdateFields = {
      name: data.name,
      weightKg: data.weightKg.toString(),
    };

    if (data.photoUrl !== undefined) {
      updateFields.photoUrl = data.photoUrl || null;
    }

    if (data.breed !== undefined) {
      updateFields.breed = data.breed || null;
    }

    if (data.isMixed !== undefined) {
      updateFields.isMixed = data.isMixed;
    }

    if (data.ageYears !== undefined && data.ageYears > 0) {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - Math.floor(data.ageYears));
      updateFields.birthDate = birthDate;
    }

    if (data.ageYears !== undefined || data.weightKg !== undefined) {
      const [currentPet] = await db
        .select()
        .from(pets)
        .where(eq(pets.id, petId))
        .limit(1);

      if (currentPet) {
        const species = currentPet.species as "dog" | "cat";
        const weightKg = data.weightKg;
        const ageYears =
          data.ageYears !== undefined
            ? data.ageYears
            : (Date.now() - new Date(currentPet.birthDate).getTime()) /
              (1000 * 60 * 60 * 24 * 365.25);
        const lifeStage = calculateSeniority({ species, weightKg, ageYears });
        updateFields.lifeStage = lifeStage;
      }
    }

    await db
      .update(pets)
      .set(updateFields)
      .where(and(eq(pets.id, petId), eq(pets.userId, user.id)));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error al actualizar mascota:", error);
    return { success: false, error: "No se pudo actualizar el perfil." };
  }
}