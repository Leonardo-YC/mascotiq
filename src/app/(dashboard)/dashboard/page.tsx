import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/index";
import { pets, subscriptions, plans, orders, planProducts, products } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { CheckCircle, Clock, LayoutDashboard } from "lucide-react";
import { stripe } from "@/lib/stripe/index";
import Stripe from "stripe";

type StripeSubWithPeriod = Stripe.Subscription & { current_period_end?: number };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const resolvedParams = await searchParams;
  const isSuccess = resolvedParams.success === "true";
  const sessionId = resolvedParams.session_id as string | undefined;

  let pendingActivation = false;

  if (isSuccess && sessionId) {
    try {
      // FIX: En lugar de verificar si el usuario tiene ALGUNA suscripción (que excluye
      // a usuarios con suscripciones previas canceladas), recuperamos primero la sesión
      // de Stripe para obtener el stripeSubscriptionId exacto y verificar ESA suscripción.
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["subscription"],
      });

      if (session.status === "complete" && session.subscription && session.metadata?.petId) {
        const stripeSub = session.subscription as StripeSubWithPeriod;

        // Verificamos si YA existe esta suscripción específica (creada por el webhook)
        const existingSpecific = await db
          .select({ id: subscriptions.id })
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, stripeSub.id))
          .limit(1);

        if (existingSpecific.length === 0) {
          // El webhook no ha disparado todavía — intentamos crear la suscripción como fallback
          pendingActivation = true;

          try {
            const stripePriceId = stripeSub.items.data[0].price.id;

            const planRecord = await db
              .select()
              .from(plans)
              .where(eq(plans.stripePriceId, stripePriceId))
              .limit(1);

            if (planRecord.length > 0) {
              const periodEnd = stripeSub.current_period_end
                ? new Date(stripeSub.current_period_end * 1000)
                : new Date();

              // Segunda verificación para evitar race condition con el webhook
              const doubleCheck = await db
                .select({ id: subscriptions.id })
                .from(subscriptions)
                .where(eq(subscriptions.stripeSubscriptionId, stripeSub.id))
                .limit(1);

              if (doubleCheck.length === 0) {
                const [newSub] = await db
                  .insert(subscriptions)
                  .values({
                    userId: user.id,
                    petId: parseInt(session.metadata.petId),
                    planId: planRecord[0].id,
                    stripeSubscriptionId: stripeSub.id,
                    status: "active",
                    currentPeriodEnd: periodEnd,
                  })
                  .returning();

                await db.insert(orders).values({
                  subscriptionId: newSub.id,
                  status: "Pendiente",
                });
              }

              pendingActivation = false;
            }
          } catch (innerErr: unknown) {
            console.error("Error en fallback de activación:", innerErr);
          }
        }
        // Si existingSpecific.length > 0, el webhook ya creó la suscripción → pendingActivation = false
      }
    } catch (err: unknown) {
      console.error("Error verificando sesión de Stripe:", err);
    }
  }

  const userPets = await db.select().from(pets).where(eq(pets.userId, user.id));

  const subsData = await db
    .select({ subscription: subscriptions, plan: plans })
    .from(subscriptions)
    .leftJoin(plans, eq(subscriptions.planId, plans.id))
    .where(eq(subscriptions.userId, user.id));

  const enrichedSubs = await Promise.all(
    subsData.map(async sub => {
      if (!sub.plan) return { ...sub, products: [], orders: [] };

      const planProds = await db
        .select({ product: products })
        .from(planProducts)
        .innerJoin(products, eq(planProducts.productId, products.id))
        .where(eq(planProducts.planId, sub.plan.id));

      const subOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.subscriptionId, sub.subscription.id))
        .orderBy(desc(orders.createdAt));

      return {
        ...sub,
        products: planProds.map(p => p.product),
        orders: subOrders,
      };
    })
  );

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3 border border-slate-200">
              <LayoutDashboard className="w-3.5 h-3.5" /> Área de Cliente
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Mi Panel</h1>
            <p className="text-slate-500 mt-2 font-medium">Gestiona las suscripciones y el perfil biológico de tus mascotas.</p>
          </div>
        </div>

        {isSuccess && !pendingActivation && (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex items-start sm:items-center gap-5 animate-in slide-in-from-top-4 shadow-sm">
            <div className="bg-emerald-500 p-3 rounded-full text-white shadow-lg shadow-emerald-500/20 shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-emerald-900 text-lg tracking-tight">¡Suscripción activada con éxito!</h3>
              <p className="text-emerald-700 text-sm font-medium mt-1">Tu plan nutricional personalizado ya está en marcha. Tu primera caja está siendo preparada.</p>
            </div>
          </div>
        )}

        {isSuccess && pendingActivation && (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-start sm:items-center gap-5 animate-in slide-in-from-top-4 shadow-sm">
            <div className="bg-amber-500 p-3 rounded-full text-white shadow-lg shadow-amber-500/20 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-amber-900 text-lg tracking-tight">¡Pago recibido! Activando plan...</h3>
              <p className="text-amber-700 text-sm font-medium mt-1">
                Esto puede tomar unos segundos.{" "}
                <a href="/dashboard" className="underline font-black hover:text-amber-900 transition-colors">
                  Actualiza la página
                </a>{" "}
                en un momento para ver tu plan activo.
              </p>
            </div>
          </div>
        )}

        <DashboardClient initialPets={userPets} initialSubs={enrichedSubs} />
      </div>
    </main>
  );
}