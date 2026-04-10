import { db } from "@/lib/db/index";
import { plans, products, planProducts } from "@/lib/db/schema";
import { Layers, Zap } from "lucide-react";
import { PlanManagerClient } from "@/components/admin/PlanManagerClient";

export default async function PlanesManagerPage() {
  // 1. Extraemos toda la data necesaria en paralelo para mayor velocidad
  const [allPlans, allProducts, allPlanProducts] = await Promise.all([
    db.select().from(plans).orderBy(plans.id),
    db.select().from(products).orderBy(products.name),
    db.select().from(planProducts)
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      
      {/* 🚀 Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Planes de Suscripción</h1>
          <p className="text-slate-500 mt-2 font-medium">
            Configura los 5 planes base, asígnales productos y actualiza sus precios sincronizados con Stripe.
          </p>
        </div>
      </div>

      {/* 💡 Banner Informativo */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-4">
        <div className="bg-blue-100 p-2 rounded-xl shrink-0">
          <Zap className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h4 className="font-bold text-blue-900">Sincronización Automática</h4>
          <p className="text-sm text-blue-700 mt-1">
            Cualquier cambio de precio que guardes aquí se actualizará automáticamente en Stripe. No necesitas modificar nada en el panel de Stripe manualmente.
          </p>
        </div>
      </div>

      {/* 🧩 Componente Interactivo (Client Component) */}
      <PlanManagerClient 
        initialPlans={allPlans} 
        availableProducts={allProducts} 
        currentRelations={allPlanProducts} 
      />

    </div>
  );
}