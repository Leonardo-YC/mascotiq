import { db } from "@/lib/db/index";
import { subscriptions, pets, plans, orders, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  TrendingUp, DollarSign, PawPrint, Package,
  XCircle, Clock, Truck, PackageCheck, Activity
} from "lucide-react";

export default async function AdminDashboardPage() {

  // ── Datos ──────────────────────────────────────────────────────────
  const allPets = await db.select({ id: pets.id }).from(pets);

  const activeSubs = await db.select({
    id: subscriptions.id,
    planId: subscriptions.planId,
    planName: plans.name,
    planPrice: plans.price,
    userId: subscriptions.userId,
    createdAt: subscriptions.createdAt,
  })
  .from(subscriptions)
  .innerJoin(plans, eq(subscriptions.planId, plans.id))
  .where(eq(subscriptions.status, "active"));

  const canceledCount = (await db.select({ id: subscriptions.id })
    .from(subscriptions)
    .where(eq(subscriptions.status, "canceled"))).length;

  const allOrders = await db.select({ id: orders.id, status: orders.status })
    .from(orders);

  const recentSubs = await db.select({
    id: subscriptions.id,
    status: subscriptions.status,
    createdAt: subscriptions.createdAt,
    planName: plans.name,
    planPrice: plans.price,
    userName: users.name,
    userEmail: users.email,
  })
  .from(subscriptions)
  .innerJoin(plans, eq(subscriptions.planId, plans.id))
  .innerJoin(users, eq(subscriptions.userId, users.id))
  .orderBy(desc(subscriptions.createdAt))
  .limit(6);

  // ── Métricas calculadas ─────────────────────────────────────────────
  const mrr = activeSubs.reduce((s, x) => s + parseFloat(x.planPrice || "0"), 0);

  const pendingOrders  = allOrders.filter(o => o.status === "Pendiente").length;
  const prepOrders     = allOrders.filter(o => o.status === "En preparación").length;
  const sentOrders     = allOrders.filter(o => o.status === "Enviado").length;
  const doneOrders     = allOrders.filter(o => o.status === "Entregado").length;

  const planDist: Record<string, number> = {};
  activeSubs.forEach(s => { planDist[s.planName] = (planDist[s.planName] || 0) + 1; });
  const maxPlanCount = Math.max(...Object.values(planDist), 1);

  const totalHistorical = activeSubs.length + canceledCount;
  const churnRate = totalHistorical > 0
    ? ((canceledCount / totalHistorical) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 font-sans pb-10">

      {/* Cabecera Boutique */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3 border border-slate-200">
            <Activity className="w-3.5 h-3.5" /> Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900">Resumen Operativo</h1>
          <p className="text-slate-500 mt-2 font-medium text-sm">
            Métricas de crecimiento y estado del sistema en tiempo real.
          </p>
        </div>
      </div>

      {/* ── FILA 1: KPI cards ── */}
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
        {[
          { label: "Suscripciones", value: activeSubs.length, icon: <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
          { label: "Ingresos MRR", value: `S/ ${mrr.toFixed(2)}`, icon: <DollarSign className="w-5 h-5 md:w-6 md:h-6" />, color: "bg-blue-50 text-blue-600 border-blue-100" },
          { label: "Mascotas", value: allPets.length, icon: <PawPrint className="w-5 h-5 md:w-6 md:h-6" />, color: "bg-purple-50 text-purple-600 border-purple-100" },
          { label: "Pendientes", value: pendingOrders, icon: <Clock className="w-5 h-5 md:w-6 md:h-6" />, color: "bg-amber-50 text-amber-600 border-amber-100" },
          { label: "Churn Rate", value: `${churnRate}%`, icon: <XCircle className="w-5 h-5 md:w-6 md:h-6" />, color: "bg-red-50 text-red-500 border-red-100" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white rounded-3xl md:rounded-[2rem] p-5 md:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-5 border ${color}`}>
              {icon}
            </div>
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight mb-1">{label}</p>
            <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* ── FILA 2: Distribución por plan + Estado de pedidos ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

        {/* Distribución por plan */}
        <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="bg-emerald-100 p-2 rounded-xl shrink-0"><Activity className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" /></div>
            <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight">Distribución por Plan</h2>
          </div>

          {Object.keys(planDist).length === 0 ? (
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 text-center text-slate-400 text-sm font-bold">Sin suscripciones activas aún.</div>
          ) : (
            <div className="space-y-4 md:space-y-5">
              {Object.entries(planDist)
                .sort((a, b) => b[1] - a[1])
                .map(([planName, count]) => {
                  const pct = Math.round((count / maxPlanCount) * 100);
                  return (
                    <div key={planName} className="group">
                      <div className="flex justify-between items-end mb-2 gap-2">
                        <span className="text-xs font-bold text-slate-700 truncate flex-1">
                          {planName.replace("Plan Senior ", "")}
                        </span>
                        <span className="text-xs font-black text-slate-900 shrink-0 ml-2">
                          {count} <span className="text-slate-400 font-bold ml-0.5 hidden sm:inline">subs</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 md:h-3 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-emerald-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {Object.keys(planDist).length > 0 && (
            <div className="mt-6 md:mt-8 pt-6 border-t border-slate-100">
              <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">MRR por plan</p>
              <div className="space-y-2 md:space-y-3">
                {activeSubs
                  .reduce<{ planName: string; mrr: number }[]>((acc, s) => {
                    const existing = acc.find(x => x.planName === s.planName);
                    const price = parseFloat(s.planPrice || "0");
                    if (existing) existing.mrr += price;
                    else acc.push({ planName: s.planName, mrr: price });
                    return acc;
                  }, [])
                  .sort((a, b) => b.mrr - a.mrr)
                  .map(({ planName, mrr: planMrr }) => (
                    <div key={planName} className="flex justify-between text-xs items-center bg-slate-50 p-2.5 md:p-3 rounded-xl border border-slate-100 gap-2">
                      <span className="text-slate-600 font-bold truncate flex-1">{planName.replace("Plan Senior ", "")}</span>
                      <span className="font-black text-slate-900 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-200 shrink-0">S/ {planMrr.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Estado de pedidos */}
        <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-6 md:mb-8">
            <div className="bg-blue-100 p-2 rounded-xl shrink-0"><Package className="w-4 h-4 md:w-5 md:h-5 text-blue-600" /></div>
            <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight">Estado de Pedidos</h2>
            <span className="ml-auto text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full shrink-0">{allOrders.length} Total</span>
          </div>

          {allOrders.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 text-center text-slate-400 text-sm font-bold">Sin pedidos aún.</div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {[
                { label: "Pendiente",      count: pendingOrders, color: "bg-amber-500",  textColor: "text-amber-700",  bg: "bg-amber-50 border-amber-100",  icon: <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" /> },
                { label: "En preparación",   count: prepOrders,    color: "bg-blue-500",   textColor: "text-blue-700",   bg: "bg-blue-50 border-blue-100",   icon: <Package className="w-3.5 h-3.5 md:w-4 md:h-4" /> },
                { label: "Enviado",          count: sentOrders,    color: "bg-purple-500", textColor: "text-purple-700", bg: "bg-purple-50 border-purple-100", icon: <Truck className="w-3.5 h-3.5 md:w-4 md:h-4" /> },
                { label: "Entregado",        count: doneOrders,    color: "bg-emerald-500",textColor: "text-emerald-700",bg: "bg-emerald-50 border-emerald-100",icon: <PackageCheck className="w-3.5 h-3.5 md:w-4 md:h-4" /> },
              ].map(({ label, count, color, textColor, bg, icon }) => (
                <div key={label} className={`flex items-center gap-3 md:gap-4 ${bg} border rounded-2xl p-3 sm:p-4 transition-colors hover:brightness-95`}>
                  <div className={`p-2 rounded-xl bg-white shadow-sm shrink-0 ${textColor}`}>{icon}</div>
                  
                  {/* FIX APLICADO: flex-1 truncate asegura que empuje pero se encoja si no hay espacio */}
                  <span className={`text-xs md:text-sm font-bold ${textColor} flex-1 truncate`}>{label}</span>
                  
                  {/* FIX APLICADO: Barrita oculta en móvil ultrapequeño, tamaño fluido, no desborda */}
                  <div className="hidden min-[400px]:block w-12 sm:w-16 lg:w-20 bg-white/60 rounded-full h-2 md:h-2.5 overflow-hidden shrink-0 ml-2">
                    <div
                      className={`${color} h-full rounded-full transition-all duration-1000`}
                      style={{ width: allOrders.length > 0 ? `${(count / allOrders.length) * 100}%` : "0%" }}
                    />
                  </div>
                  
                  {/* FIX APLICADO: Numero pegado al final pero seguro dentro del padding */}
                  <span className={`text-sm md:text-base font-black ${textColor} shrink-0 ml-2`}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── FILA 3: Últimas suscripciones ── */}
      <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm p-4 sm:p-6 md:p-8 overflow-hidden w-full max-w-[100vw]">
        <div className="flex items-center gap-3 mb-5 md:mb-6">
          <div className="bg-slate-100 p-2 rounded-xl shrink-0"><TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-slate-600" /></div>
          <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight">Últimas Suscripciones</h2>
        </div>

        {recentSubs.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-6 md:p-8 text-center text-slate-400 text-sm font-bold">Sin suscripciones aún.</div>
        ) : (
          <div className="overflow-x-auto w-full -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead>
                <tr className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest border-b-2 border-slate-100">
                  <th className="pb-3 md:pb-4 pl-2">Cliente</th>
                  <th className="pb-3 md:pb-4">Plan</th>
                  <th className="pb-3 md:pb-4">Precio</th>
                  <th className="pb-3 md:pb-4">Estado</th>
                  <th className="pb-3 md:pb-4">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentSubs.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-3 md:py-4 pl-2 pr-4">
                      <p className="font-black text-slate-900 text-xs truncate max-w-[120px] md:max-w-[180px]">{sub.userName}</p>
                      <p className="text-slate-500 font-medium text-[9px] md:text-[10px] mt-0.5 truncate max-w-[120px] md:max-w-[180px]">{sub.userEmail}</p>
                    </td>
                    <td className="py-3 md:py-4 pr-4 text-xs text-slate-600 font-bold">
                      {sub.planName.replace("Plan Senior ", "")}
                    </td>
                    <td className="py-3 md:py-4 pr-4 text-xs font-black text-slate-900">
                      <span className="bg-slate-100 px-2 py-1 md:px-2.5 rounded-lg whitespace-nowrap">S/ {sub.planPrice}</span>
                    </td>
                    <td className="py-3 md:py-4 pr-4">
                      <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 md:px-2.5 py-1 rounded-md whitespace-nowrap ${
                        sub.status === "active"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : sub.status === "canceled"
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-amber-50 text-amber-600 border border-amber-200"
                      }`}>
                        {sub.status === "active" ? "Activa" : sub.status === "canceled" ? "Cancelada" : sub.status}
                      </span>
                    </td>
                    <td className="py-3 md:py-4 text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-wider whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString("es-PE", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}