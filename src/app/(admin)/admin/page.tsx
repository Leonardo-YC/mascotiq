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

  // Distribución de suscripciones activas por plan
  const planDist: Record<string, number> = {};
  activeSubs.forEach(s => { planDist[s.planName] = (planDist[s.planName] || 0) + 1; });
  const maxPlanCount = Math.max(...Object.values(planDist), 1);

  // Tasa de cancelación (sobre total histórico)
  const totalHistorical = activeSubs.length + canceledCount;
  const churnRate = totalHistorical > 0
    ? ((canceledCount / totalHistorical) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">

      {/* Cabecera */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Panel de Control</h1>
        <p className="text-slate-500 mt-1 font-medium text-sm">
          Resumen operativo de Mascotiq en tiempo real.
        </p>
      </div>

      {/* ── FILA 1: KPI cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Suscripciones activas",
            value: activeSubs.length,
            icon: <TrendingUp className="w-5 h-5" />,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Ingresos MRR",
            value: `S/ ${mrr.toFixed(2)}`,
            icon: <DollarSign className="w-5 h-5" />,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Mascotas registradas",
            value: allPets.length,
            icon: <PawPrint className="w-5 h-5" />,
            color: "bg-orange-50 text-orange-600",
          },
          {
            label: "Pedidos pendientes",
            value: pendingOrders,
            icon: <Clock className="w-5 h-5" />,
            color: "bg-amber-50 text-amber-600",
          },
          {
            label: "Tasa de cancelación",
            value: `${churnRate}%`,
            icon: <XCircle className="w-5 h-5" />,
            color: "bg-red-50 text-red-500",
          },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              {icon}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-tight mb-1">{label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* ── FILA 2: Distribución por plan + Estado de pedidos ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Distribución por plan */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-black text-slate-900">Distribución por Plan</h2>
          </div>

          {Object.keys(planDist).length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Sin suscripciones activas aún.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(planDist)
                .sort((a, b) => b[1] - a[1])
                .map(([planName, count]) => {
                  const pct = Math.round((count / maxPlanCount) * 100);
                  return (
                    <div key={planName}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[200px]">
                          {planName.replace("Plan Senior ", "")}
                        </span>
                        <span className="text-xs font-black text-slate-900 ml-2 shrink-0">
                          {count} sub{count !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div
                          className="bg-emerald-500 h-2.5 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Mini leyenda MRR por plan */}
          {Object.keys(planDist).length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">MRR por plan</p>
              <div className="space-y-1.5">
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
                    <div key={planName} className="flex justify-between text-xs">
                      <span className="text-slate-600 truncate">{planName.replace("Plan Senior ", "")}</span>
                      <span className="font-black text-slate-900 ml-2">S/ {planMrr.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Estado de pedidos */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-blue-500" />
            <h2 className="text-base font-black text-slate-900">Estado de Pedidos</h2>
            <span className="ml-auto text-xs text-slate-400 font-medium">{allOrders.length} total</span>
          </div>

          {allOrders.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Sin pedidos aún.</p>
          ) : (
            <div className="space-y-4">
              {[
                { label: "Pendiente",        count: pendingOrders, color: "bg-amber-500",  textColor: "text-amber-700",  bg: "bg-amber-50",  icon: <Clock className="w-4 h-4" /> },
                { label: "En preparación",   count: prepOrders,    color: "bg-blue-500",   textColor: "text-blue-700",   bg: "bg-blue-50",   icon: <Package className="w-4 h-4" /> },
                { label: "Enviado",          count: sentOrders,    color: "bg-purple-500", textColor: "text-purple-700", bg: "bg-purple-50", icon: <Truck className="w-4 h-4" /> },
                { label: "Entregado",        count: doneOrders,    color: "bg-emerald-500",textColor: "text-emerald-700",bg: "bg-emerald-50",icon: <PackageCheck className="w-4 h-4" /> },
              ].map(({ label, count, color, textColor, bg, icon }) => (
                <div key={label} className={`flex items-center gap-4 ${bg} rounded-xl p-3`}>
                  <div className={`${textColor}`}>{icon}</div>
                  <span className={`text-sm font-bold ${textColor} flex-1`}>{label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-white/60 rounded-full h-2">
                      <div
                        className={`${color} h-2 rounded-full`}
                        style={{ width: allOrders.length > 0 ? `${(count / allOrders.length) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className={`text-sm font-black ${textColor} w-5 text-right`}>{count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── FILA 3: Últimas suscripciones ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-slate-500" />
          <h2 className="text-base font-black text-slate-900">Últimas Suscripciones</h2>
        </div>

        {recentSubs.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">Sin suscripciones aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-3 pr-4">Cliente</th>
                  <th className="pb-3 pr-4">Plan</th>
                  <th className="pb-3 pr-4">Precio</th>
                  <th className="pb-3 pr-4">Estado</th>
                  <th className="pb-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentSubs.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="font-bold text-slate-900 text-xs">{sub.userName}</p>
                      <p className="text-slate-400 text-[10px]">{sub.userEmail}</p>
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-600 font-medium">
                      {sub.planName.replace("Plan Senior ", "")}
                    </td>
                    <td className="py-3 pr-4 text-xs font-black text-slate-900">
                      S/ {sub.planPrice}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        sub.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : sub.status === "canceled"
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {sub.status === "active" ? "Activa" : sub.status === "canceled" ? "Cancelada" : sub.status}
                      </span>
                    </td>
                    <td className="py-3 text-[10px] text-slate-400 font-medium">
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