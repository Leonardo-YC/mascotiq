import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { pets, subscriptions, planProducts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ pets: [] });

  const userPets = await db
    .select({
      id: pets.id,
      name: pets.name,
      species: pets.species,
      lifeStage: pets.lifeStage,
      weightKg: pets.weightKg,
    })
    .from(pets)
    .where(eq(pets.userId, userId));

  // Para cada mascota, obtener su plan activo y los productos de ese plan
  const petsWithPlanData = await Promise.all(
    userPets.map(async pet => {
      const activeSub = await db
        .select({ planId: subscriptions.planId, status: subscriptions.status })
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.petId, pet.id),
            eq(subscriptions.status, "active")
          )
        )
        .limit(1);

      if (activeSub.length === 0) {
        return { ...pet, activePlanId: null, activePlanProductIds: [] };
      }

      const activePlanId = activeSub[0].planId;

      // Productos que incluye el plan activo de esta mascota
      const planProds = await db
        .select({ productId: planProducts.productId })
        .from(planProducts)
        .where(eq(planProducts.planId, activePlanId));

      return {
        ...pet,
        activePlanId,
        activePlanProductIds: planProds.map(p => p.productId),
      };
    })
  );

  return NextResponse.json({ pets: petsWithPlanData });
}