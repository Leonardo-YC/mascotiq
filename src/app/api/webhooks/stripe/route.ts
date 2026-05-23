import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/index";
import { db } from "@/lib/db/index";
import { subscriptions, plans, orders, users, pets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { sendEmail } from "@/actions/email-service";
import WelcomeEmail from "@/emails/WelcomeEmail";
import PaymentFailedEmail from "@/emails/PaymentFailedEmail";
import { render } from "@react-email/components";

interface StripeSubscriptionData {
  id: string;
  status: string;
  current_period_end: number;
  items: {
    data: Array<{
      price: {
        id: string;
      };
    }>;
  };
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature");

  if (!signature) {
    return new NextResponse("Falta la firma de Stripe", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    console.error("⚠️ Error de Webhook:", errorMessage);
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  try {
    switch (event.type) {
      // ── 1. Checkout completado
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session & {
          subscription: string;
          customer: string;
        };

        const userId = session.metadata?.userId;
        const petIdStr = session.metadata?.petId;

        if (userId && petIdStr) {
          const stripeSubscriptionId = session.subscription;
          const stripeCustomerId = session.customer;

          // FIX: Verificamos si esta suscripción ya fue creada (por el dashboard fallback)
          // antes de intentar insertarla, evitando unique constraint violations e infinitos reintentos.
          const existingSub = await db
            .select({ id: subscriptions.id })
            .from(subscriptions)
            .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
            .limit(1);

          if (existingSub.length > 0) {
            console.log("ℹ️ Suscripción ya existe (creada por el dashboard). Webhook ignorado.");
            break;
          }

          const subscription = (await stripe.subscriptions.retrieve(
            stripeSubscriptionId
          )) as unknown as StripeSubscriptionData;

          const stripePriceId = subscription.items.data[0]?.price.id;

          if (!stripePriceId) throw new Error("No se encontró el ID del precio");

          if (stripeCustomerId) {
            await db
              .update(users)
              .set({ stripeCustomerId })
              .where(eq(users.id, userId));
          }

          let planRecord = await db
            .select()
            .from(plans)
            .where(eq(plans.stripePriceId, stripePriceId))
            .limit(1);

          if (planRecord.length === 0) {
            const priceData = await stripe.prices.retrieve(stripePriceId);
            const productData = await stripe.products.retrieve(priceData.product as string);

            const [newPlan] = await db
              .insert(plans)
              .values({
                name: productData.name,
                price: ((priceData.unit_amount ?? 0) / 100).toFixed(2),
                stripePriceId,
                stripeProductId: priceData.product as string,
                interval: (priceData.recurring?.interval as string) || "monthly",
                isActive: true,
              })
              .returning();
            planRecord = [newPlan];
          }

          const periodEnd = new Date(subscription.current_period_end * 1000);

          const [newSub] = await db
            .insert(subscriptions)
            .values({
              userId,
              petId: parseInt(petIdStr, 10),
              planId: planRecord[0].id,
              stripeSubscriptionId,
              status: "active",
              currentPeriodEnd: periodEnd,
            })
            .returning();

          await db.insert(orders).values({
            subscriptionId: newSub.id,
            status: "Pendiente",
          });

          console.log("✅ Suscripción y Pedido guardados en Neon DB.");

          try {
            const [userData] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
            const [petData] = await db.select().from(pets).where(eq(pets.id, parseInt(petIdStr, 10))).limit(1);
            if (userData && petData) {
              const emailHtml = await render(
                WelcomeEmail({ ownerName: userData.name, petName: petData.name })
              );
              await sendEmail({
                to: userData.email,
                subject: `¡Bienvenido al plan de nutrición de ${petData.name}! 🐾`,
                html: emailHtml,
              });
            }
          } catch (emailError) {
            console.error("❌ Error al enviar email de bienvenida:", emailError);
          }
        }
        break;
      }

      // ── 2. Factura pagada
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice & {
          subscription: string;
          billing_reason: string;
        };

        if (!invoice.subscription) break;

        if (invoice.billing_reason === "subscription_create") {
          console.log("ℹ️ Primera factura — se omite.");
          break;
        }

        const stripeSubId = invoice.subscription;

        const stripeSub = (await stripe.subscriptions.retrieve(
          stripeSubId
        )) as unknown as StripeSubscriptionData;

        const periodEnd = new Date(stripeSub.current_period_end * 1000);

        const [updatedSub] = await db
          .update(subscriptions)
          .set({ status: "active", currentPeriodEnd: periodEnd })
          .where(eq(subscriptions.stripeSubscriptionId, stripeSubId))
          .returning();

        if (updatedSub) {
          await db.insert(orders).values({
            subscriptionId: updatedSub.id,
            status: "Pendiente",
          });
          console.log("💰 Renovación: nuevo pedido creado.");
        }
        break;
      }

      // ── 3. Pago fallido
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice & { subscription: string };
        if (!invoice.subscription) break;

        const [updatedSub] = await db
          .update(subscriptions)
          .set({ status: "past_due" })
          .where(eq(subscriptions.stripeSubscriptionId, invoice.subscription))
          .returning();

        console.log("❌ Pago fallido → past_due.");

        if (updatedSub) {
          try {
            const [userData] = await db.select().from(users).where(eq(users.id, updatedSub.userId)).limit(1);
            if (userData) {
              const emailHtml = await render(
                PaymentFailedEmail({
                  ownerName: userData.name,
                  updateUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
                })
              );
              await sendEmail({
                to: userData.email,
                subject: "⚠️ Problema con tu pago en Mascotiq",
                html: emailHtml,
              });
            }
          } catch (emailError) {
            console.error("❌ Error al enviar email de pago fallido:", emailError);
          }
        }
        break;
      }

      // ── 4. Suscripción cancelada
      case "customer.subscription.deleted": {
        const subscription = event.data.object as unknown as StripeSubscriptionData;
        await db
          .update(subscriptions)
          .set({ status: "canceled" })
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
        console.log("🛑 Suscripción cancelada.");
        break;
      }

      // ── 5. Suscripción actualizada
      case "customer.subscription.updated": {
        const subscription = event.data.object as unknown as StripeSubscriptionData;
        const periodEnd = new Date(subscription.current_period_end * 1000);
        await db
          .update(subscriptions)
          .set({ status: subscription.status, currentPeriodEnd: periodEnd })
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
        console.log(`🔄 Suscripción actualizada: estado=${subscription.status}`);
        break;
      }
    }

    return new NextResponse("Webhook procesado", { status: 200 });
  } catch (error) {
    console.error("Error al interactuar con Neon DB:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}