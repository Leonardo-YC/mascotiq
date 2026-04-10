"use server";

import { db } from "@/lib/db/index";
import { plans, planProducts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { stripe } from "@/lib/stripe/index";
import { auth } from "@clerk/nextjs/server";

// 1. Obtener todos los planes
export async function getAdminPlans() {
  try {
    const allPlans = await db.select().from(plans).orderBy(plans.id);
    return { success: true, data: allPlans };
  } catch (error) {
    return { success: false, error: "Error al cargar los planes." };
  }
}

// 2. Actualizar precio — lógica correcta con Stripe
export async function updatePlanPrice(
  planId: number,
  planName: string,
  newPrice: number,
  interval: 'monthly' | 'bimonthly'
) {
  // Protección de rol
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== 'admin') return { success: false, error: "Sin permisos." };

  try {
    // Buscamos si el plan ya tiene un Product en Stripe
    const [currentPlan] = await db.select().from(plans).where(eq(plans.id, planId));

    let stripeProductId = currentPlan.stripeProductId;

    // A. Si NO tiene Product en Stripe todavía, lo creamos UNA SOLA VEZ
    if (!stripeProductId) {
      const stripeProduct = await stripe.products.create({
        name: planName,
        metadata: { planId: planId.toString() },
      });
      stripeProductId = stripeProduct.id;
    }

    // B. Siempre creamos un nuevo Price (los precios en Stripe son inmutables)
    const intervalCount = interval === 'bimonthly' ? 2 : 1;
    const stripePrice = await stripe.prices.create({
      currency: 'pen',
      unit_amount: Math.round(newPrice * 100),
      recurring: {
        interval: 'month',
        interval_count: intervalCount,
      },
      product: stripeProductId, // ← usa el Product existente
    });

    // C. Guardamos stripeProductId Y el nuevo stripePriceId en BD
    await db.update(plans)
      .set({
        price: newPrice.toString(),
        stripePriceId: stripePrice.id,
        stripeProductId: stripeProductId, // ← se guarda la primera vez, no cambia después
        interval,
      })
      .where(eq(plans.id, planId));

    revalidatePath("/admin/planes");
    return { success: true, message: "Precio actualizado y sincronizado con Stripe." };

  } catch (error) {
    console.error("Error Stripe:", error);
    return { success: false, error: "No se pudo sincronizar con Stripe." };
  }
}

// 3. Asignar productos a un plan
export async function updatePlanProducts(planId: number, productIds: number[]) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== 'admin') return { success: false, error: "Sin permisos." };

  try {
    await db.delete(planProducts).where(eq(planProducts.planId, planId));
    if (productIds.length > 0) {
      await db.insert(planProducts).values(
        productIds.map(productId => ({ planId, productId }))
      );
    }
    revalidatePath("/admin/planes");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al actualizar los productos del plan." };
  }
}