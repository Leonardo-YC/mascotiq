"use server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe/index";
import { db } from "@/lib/db/index";
import { subscriptions, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function openCustomerPortal() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Debes iniciar sesión para gestionar tu suscripción.");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const [userData] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  let customerId: string | null = userData?.stripeCustomerId || null;

  if (!customerId) {
    const userSubs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (userSubs.length === 0) {
      throw new Error("No tienes ninguna suscripción registrada para gestionar.");
    }

    const stripeSub = await stripe.subscriptions.retrieve(
      userSubs[0].stripeSubscriptionId
    );
    customerId = stripeSub.customer as string;

    if (customerId) {
      await db
        .update(users)
        .set({ stripeCustomerId: customerId })
        .where(eq(users.id, userId));
    }
  }

  if (!customerId) {
    throw new Error("No se encontró tu cuenta de pagos. Contacta a soporte.");
  }

  let portalUrl: string;
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/dashboard`,
    });
    if (!portalSession.url) {
      throw new Error("Stripe no devolvió una URL válida.");
    }
    portalUrl = portalSession.url;
  } catch (error: unknown) {
    console.error("Error al crear sesión del portal:", error);
    throw new Error("No se pudo abrir el portal de facturación. Intenta de nuevo.");
  }

  redirect(portalUrl);
}