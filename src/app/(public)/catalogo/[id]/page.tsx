import { getProductById } from "@/actions/catalogo-actions";
import { db } from "@/lib/db/index";
import { planProducts, plans } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Leaf, ShoppingBag, CheckCircle2, ShieldCheck } from "lucide-react";
import { ProductCTA } from "@/components/catalogo/ProductCTA";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);
  if (isNaN(productId)) redirect("/catalogo");

  const response = await getProductById(productId);
  if (!response.success || !response.data) redirect("/catalogo");
  const product = response.data;

  const productPlans = await db
    .select({
      planId: plans.id,
      stripePriceId: plans.stripePriceId,
      planName: plans.name,
    })
    .from(planProducts)
    .innerJoin(plans, eq(planProducts.planId, plans.id))
    .where(eq(planProducts.productId, productId));

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500 font-sans">
      <div className="max-w-5xl mx-auto">

        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors font-bold mb-7"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la vitrina
        </Link>

        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 lg:gap-12 items-start">

          {/* ── Columna izquierda: imagen + planes ── */}
          <div className="w-full md:w-[300px] lg:w-[340px] shrink-0 md:sticky md:top-28 space-y-5">

            {product.imageUrl ? (
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 340px"
                />
              </div>
            ) : (
              <div className="relative w-full aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-slate-50 flex flex-col items-center justify-center gap-2">
                <ShoppingBag className="w-16 h-16 text-gray-300" strokeWidth={1} />
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Sin imagen</span>
              </div>
            )}

            {productPlans.length > 0 && (
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest mb-3">
                  Disponible en los planes:
                </p>
                <ul className="space-y-2.5">
                  {productPlans.map(plan => (
                    <li key={plan.planId} className="flex items-center gap-2 text-sm text-emerald-800 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {plan.planName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Columna derecha ── */}
          <div className="flex-1 space-y-6 w-full min-w-0">

            <div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-widest border border-emerald-100">
                {product.categoryName || "Fórmula Especializada"}
              </span>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mt-4 mb-3 leading-tight tracking-tight">
                {product.name}
              </h1>
              <p className="text-base text-slate-500 leading-relaxed">
                {product.description}
              </p>
            </div>

            <hr className="border-slate-100" />

            {product.ingredients && (
              <div>
                <p className="text-xs font-black text-slate-700 flex items-center gap-1.5 mb-2.5 uppercase tracking-wider">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  Ingredientes Activos
                </p>
                <div className="bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed font-medium">
                  {product.ingredients}
                </div>
              </div>
            )}

            {/* Caja de precio */}
            <div className="bg-slate-900 rounded-2xl px-6 py-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">Exclusivo con Suscripción</span>
                  <span className="text-sm text-slate-500 line-through ml-auto">S/ {product.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-slate-300">Llévalo en tu Plan por</span>
                  <span className="text-4xl font-black text-white">S/ {product.subscriptionPrice}</span>
                </div>
              </div>
            </div>

            {/* CTA con validación */}
            <ProductCTA productId={product.id} validPlans={productPlans} />
          </div>
        </div>
      </div>
    </main>
  );
}