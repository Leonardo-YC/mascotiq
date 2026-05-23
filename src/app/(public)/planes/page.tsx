import { db } from "@/lib/db/index";
import { plans, products, planProducts, pets, subscriptions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { PlanesPublicClient } from "@/components/planes/PlanesPublicClient";

export default async function PlanesPublicPage({
  searchParams,
}: {
  searchParams: Promise<{ recommended?: string }>;
}) {
  const resolved = await searchParams;
  const recommendedPlanName = resolved.recommended
    ? decodeURIComponent(resolved.recommended)
    : null;

  const { userId } = await auth();

  const [allPlans, allProducts, allRelations] = await Promise.all([
    db.select().from(plans).where(eq(plans.isActive, true)).orderBy(plans.id),
    db.select().from(products),
    db.select().from(planProducts),
  ]);

  const enrichedPlans = allPlans.map(plan => ({
    ...plan,
    products: allRelations
      .filter(r => r.planId === plan.id)
      .map(r => allProducts.find(p => p.id === r.productId))
      .filter((p): p is typeof allProducts[0] => p !== undefined),
  }));

  let userPets: {
    id: number;
    name: string;
    species: string;
    lifeStage: string | null;
    weightKg: string;
  }[] = [];

  let petActivePlans: { petId: number; planId: number }[] = [];

  if (userId) {
    userPets = await db
      .select({
        id: pets.id,
        name: pets.name,
        species: pets.species,
        lifeStage: pets.lifeStage,
        weightKg: pets.weightKg,
      })
      .from(pets)
      .where(eq(pets.userId, userId));

    const activeSubs = await db
      .select({ planId: subscriptions.planId, petId: subscriptions.petId })
      .from(subscriptions)
      .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")));

    petActivePlans = activeSubs.map(s => ({ petId: s.petId, planId: s.planId }));
  }

  const userActivePlanIds = [...new Set(petActivePlans.map(s => s.planId))];

  return (
    <PlanesPublicClient
      plans={enrichedPlans}
      userPets={userPets}
      userActivePlanIds={userActivePlanIds}
      petActivePlans={petActivePlans}
      isLoggedIn={!!userId}
      recommendedPlanName={recommendedPlanName}
    />
  );
}