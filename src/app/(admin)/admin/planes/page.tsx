import { db } from "@/lib/db/index";
import { plans, products, planProducts } from "@/lib/db/schema";
import { Layers, Zap } from "lucide-react";
import { PlanManagerClient, type AdminPlan, type AdminProduct, type AdminPlanProduct } from "@/components/admin/PlanManagerClient";

export default async function PlanesManagerPage() {
  const [allPlans, allProducts, allPlanProducts] = await Promise.all([
    db.select().from(plans).orderBy(plans.id),
    db.select().from(products).orderBy(products.name),
    db.select().from(planProducts)
  ]);

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 font-sans pb-8 md:pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1 md:px-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3 border border-slate-200">
            <Layers className="w-3.5 h-3.5" /> Suscripciones
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-slate-900">Gestión de Planes</h1>
          <p className="text-slate-500 mt-1 sm:mt-2 font-medium text-sm sm:text-base">
            Configura los planes base, asigna fórmulas y sincroniza precios con Stripe.
          </p>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-100 p-5 sm:p-6 rounded-2xl md:rounded-[2rem] flex items-start sm:items-center gap-4 sm:gap-5 shadow-sm">
        <div className="bg-blue-600 p-3 rounded-xl sm:rounded-2xl shrink-0 text-white">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h4 className="font-black text-blue-900 text-base sm:text-lg tracking-tight">Sincronización Automática</h4>
          <p className="text-xs sm:text-sm text-blue-700 mt-1 font-medium leading-relaxed">
            Cualquier cambio de precio que guardes aquí se actualizará automáticamente en la pasarela de pagos. No necesitas modificar nada en el panel de Stripe manualmente.
          </p>
        </div>
      </div>
      <PlanManagerClient
        initialPlans={allPlans as AdminPlan[]}
        availableProducts={allProducts as AdminProduct[]}
        currentRelations={allPlanProducts as AdminPlanProduct[]}
      />
    </div>
  );
}