import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/index";
import { pets, subscriptions, plans, orders, planProducts, products } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { CheckCircle, Clock } from "lucide-react";
import { stripe } from "@/lib/stripe/index";

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

  // ── FIX: Timing del webhook ──────────────────────────────────────────
  // Cuando Stripe redirige de vuelta con ?success=true&session_id=xxx,
  // el webhook puede no haber disparado aún. Si la suscripción no aparece
  // en nuestra BD 2 segundos después del pago, mostramos un aviso.
  // Como este es un Server Component, no podemos hacer polling real,
  // pero podemos verificar directamente con Stripe si el session_id existe.
  let pendingActivation = false;

  if (isSuccess && sessionId) {
    try {
      // Verificar si ya tenemos la suscripción en nuestra BD
      const existingSubs = await db
        .select({ id: subscriptions.id })
        .from(subscriptions)
        .where(eq(subscriptions.userId, user.id))
        .limit(1);

      if (existingSubs.length === 0) {
        // El webhook aún no procesó — indicamos estado pendiente
        pendingActivation = true;
        
        // Intentamos crear la suscripción directamente desde la session de Stripe
        // como fallback en caso de que el webhook falle o demore
        try {
          const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["subscription"],
          });

          if (session.status === "complete" && session.subscription && session.metadata?.petId) {
            const stripeSub = session.subscription as any;
            const stripePriceId = stripeSub.items.data[0].price.id;

            let planRecord = await db
              .select()
              .from(plans)
              .where(eq(plans.stripePriceId, stripePriceId))
              .limit(1);

            if (planRecord.length > 0) {
              const periodEnd = stripeSub.current_period_end
                ? new Date(stripeSub.current_period_end * 1000)
                : new Date();

              // Upsert: solo crear si no existe ya (el webhook puede haber llegado mientras tanto)
              const existing = await db
                .select({ id: subscriptions.id })
                .from(subscriptions)
                .where(eq(subscriptions.stripeSubscriptionId, stripeSub.id))
                .limit(1);

              if (existing.length === 0) {
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
          }
        } catch (stripeErr) {
          console.error("Error verificando sesión de Stripe:", stripeErr);
          // pendingActivation sigue siendo true, el usuario verá el aviso
        }
      }
    } catch (err) {
      console.error("Error verificando suscripción:", err);
    }
  }
  // ────────────────────────────────────────────────────────────────────

  // 1. Mascotas del usuario
  const userPets = await db.select().from(pets).where(eq(pets.userId, user.id));

  // 2. Suscripciones con plan
  const subsData = await db
    .select({ subscription: subscriptions, plan: plans })
    .from(subscriptions)
    .leftJoin(plans, eq(subscriptions.planId, plans.id))
    .where(eq(subscriptions.userId, user.id));

  // 3. Enriquecer con productos y pedidos
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
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-500 mt-1">Gestiona las suscripciones y perfiles de tus mascotas.</p>
        </div>

        {/* Banner de éxito normal */}
        {isSuccess && !pendingActivation && (
          <div className="bg-green-50 border border-green-200 p-5 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 shadow-sm">
            <div className="bg-green-100 p-2.5 rounded-full text-green-600">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-green-900">¡Suscripción activada con éxito!</h3>
              <p className="text-green-700 text-sm">Tu plan nutricional personalizado ya está en marcha. Tu primera caja está siendo preparada.</p>
            </div>
          </div>
        )}

        {/* Banner de activación pendiente */}
        {isSuccess && pendingActivation && (
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 shadow-sm">
            <div className="bg-amber-100 p-2.5 rounded-full text-amber-600">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900">¡Pago recibido! Tu plan se está activando...</h3>
              <p className="text-amber-700 text-sm">
                Esto puede tomar unos segundos.{" "}
                <button
                  onClick={() => window.location.reload()}
                  className="underline font-bold hover:text-amber-900"
                >
                  Actualiza la página
                </button>{" "}
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