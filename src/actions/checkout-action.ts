"use server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db/index";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function createCheckoutSession(petId: number, stripePriceId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Debes iniciar sesión para suscribirte.");
  if (!stripePriceId) throw new Error("ID de producto no válido.");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // FIX: Si el usuario ya tiene un Stripe Customer, lo reutilizamos
  // para no crear duplicados que rompan el portal de autogestión.
  const [userData] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const sessionParams: any = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: stripePriceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/catalogo?canceled=true`,
    metadata: {
      userId,
      petId: petId.toString(),
    },
  };

  // Si ya existe el customer, Stripe lo reutiliza automáticamente
  if (userData?.stripeCustomerId) {
    sessionParams.customer = userData.stripeCustomerId;
  } else {
    // Si no existe, pasamos el email para que Stripe cree el customer
    // y lo guardamos en el webhook cuando llegue checkout.session.completed
    sessionParams.customer_email = userData?.email;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  if (session.url) redirect(session.url);
}