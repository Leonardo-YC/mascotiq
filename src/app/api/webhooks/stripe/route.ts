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

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("⚠️ Error de Webhook:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {

      // ── 1. Checkout completado: crea suscripción, primer pedido, email bienvenida
      case "checkout.session.completed": {
        const session = event.data.object as any;

        if (session.metadata?.userId && session.metadata?.petId) {
          const stripeSubscriptionId = session.subscription;
          const stripeCustomerId = session.customer as string;

          const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId) as any;
          const stripePriceId = subscription.items.data[0].price.id;
          if (!stripePriceId) throw new Error("No se encontró el ID del precio");

          // FIX: Guardar el stripeCustomerId en la tabla users
          // Esto es lo que necesita openCustomerPortal para abrir el portal
          if (stripeCustomerId) {
            await db
              .update(users)
              .set({ stripeCustomerId })
              .where(eq(users.id, session.metadata.userId));
          }

          // Buscar o crear el plan en nuestra BD
          let planRecord = await db
            .select()
            .from(plans)
            .where(eq(plans.stripePriceId, stripePriceId))
            .limit(1);

          if (planRecord.length === 0) {
            const priceData = await stripe.prices.retrieve(stripePriceId) as any;
            const productData = await stripe.products.retrieve(priceData.product) as any;
            const [newPlan] = await db
              .insert(plans)
              .values({
                name: productData.name,
                price: (priceData.unit_amount / 100).toFixed(2),
                stripePriceId,
                stripeProductId: priceData.product,
                interval: priceData.recurring?.interval || "monthly",
                isActive: true,
              })
              .returning();
            planRecord = [newPlan];
          }

          const periodEnd = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : new Date();

          const [newSub] = await db
            .insert(subscriptions)
            .values({
              userId: session.metadata.userId,
              petId: parseInt(session.metadata.petId),
              planId: planRecord[0].id,
              stripeSubscriptionId,
              status: "active",
              currentPeriodEnd: periodEnd,
            })
            .returning();

          // Primer pedido mensual
          await db.insert(orders).values({
            subscriptionId: newSub.id,
            status: "Pendiente",
          });

          console.log("✅ Suscripción y Pedido guardados en Neon DB.");

          // Email de bienvenida
          try {
            const [userData] = await db
              .select()
              .from(users)
              .where(eq(users.id, session.metadata.userId))
              .limit(1);
            const [petData] = await db
              .select()
              .from(pets)
              .where(eq(pets.id, parseInt(session.metadata.petId)))
              .limit(1);

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

      // ── 2. Factura pagada: solo renovaciones (no la primera)
      case "invoice.paid": {
        const invoice = event.data.object as any;
        if (!invoice.subscription) break;

        // FIX: Ignorar la primera factura (ya manejada por checkout.session.completed)
        if (invoice.billing_reason === "subscription_create") {
          console.log("ℹ️ Primera factura — se omite (ya manejada por checkout).");
          break;
        }

        const stripeSubId = invoice.subscription;
        const stripeSub = await stripe.subscriptions.retrieve(stripeSubId) as any;
        const periodEnd = stripeSub.current_period_end
          ? new Date(stripeSub.current_period_end * 1000)
          : new Date();

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

      // ── 3. Pago fallido: marca past_due + email alerta
      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        if (!invoice.subscription) break;

        const [updatedSub] = await db
          .update(subscriptions)
          .set({ status: "past_due" })
          .where(eq(subscriptions.stripeSubscriptionId, invoice.subscription))
          .returning();

        console.log("❌ Pago fallido → past_due.");

        if (updatedSub) {
          try {
            const [userData] = await db
              .select()
              .from(users)
              .where(eq(users.id, updatedSub.userId))
              .limit(1);

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

      // ── 4. Suscripción cancelada (desde portal de Stripe)
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        await db
          .update(subscriptions)
          .set({ status: "canceled" })
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
        console.log("🛑 Suscripción cancelada.");
        break;
      }

      // ── 5. Suscripción actualizada (pausa, cambio de plan desde portal)
      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const periodEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : new Date();

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