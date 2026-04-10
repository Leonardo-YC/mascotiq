"use client";
import { useRouter } from "next/navigation";
import { Edit, Package, Save, X, RefreshCw, Layers, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { updatePlanPrice } from "@/actions/plan-actions";

export function PlanManagerClient({
  initialPlans,
  availableProducts,
  currentRelations,
}: {
  initialPlans: any[];
  availableProducts: any[];
  currentRelations: any[];
}) {
  const router = useRouter();
  // FIX: NO usar useState(initialPlans). Sin estado local los planes
  // siempre reflejan los props del servidor tras router.refresh().
  const plans = initialPlans;

  const [modalState, setModalState] = useState<{ isOpen: boolean; plan: any }>({
    isOpen: false,
    plan: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  const openModal = (plan: any) => setModalState({ isOpen: true, plan });
  const closeModal = () => setModalState({ isOpen: false, plan: null });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const newPrice = parseFloat(formData.get("price") as string);
    const interval = formData.get("interval") as "monthly" | "bimonthly";

    await updatePlanPrice(modalState.plan.id, modalState.plan.name, newPrice, interval);

    setIsSubmitting(false);
    closeModal();
    setSuccessBanner(true);
    setTimeout(() => setSuccessBanner(false), 3000);
    // FIX: router.refresh() actualiza el server component y pasa nuevos props.
    // Como no usamos useState para plans, la UI se actualiza correctamente.
    router.refresh();
  };

  return (
    <>
      {successBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          Plan actualizado y sincronizado con Stripe correctamente.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan: any) => {
          const planProductsList = currentRelations
            .filter((r: any) => r.planId === plan.id)
            .map((r: any) => availableProducts.find((p: any) => p.id === r.productId))
            .filter(Boolean);

          const isPriceZero = parseFloat(plan.price) === 0;

          return (
            <div key={plan.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-emerald-50 p-3 rounded-2xl">
                  <Layers className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 uppercase">
                    {plan.interval === "monthly" ? "Mensual" : "Bimestral"}
                  </span>
                  {isPriceZero && (
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Sin precio
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-0.5">{plan.name}</h3>
              <p className={`text-2xl font-black mb-2 ${isPriceZero ? "text-amber-500" : "text-emerald-600"}`}>
                {isPriceZero ? "Sin configurar" : `S/ ${plan.price}`}
                {!isPriceZero && <span className="text-sm text-slate-400 font-medium"> /mes</span>}
              </p>
              {plan.description && (
                <p className="text-xs text-slate-500 font-medium mb-4">{plan.description}</p>
              )}

              <div className="flex-1 mb-5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">
                  Productos incluidos ({planProductsList.length})
                </p>
                {planProductsList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                    Asígnalos desde Catálogo → Editar producto.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {planProductsList.map((p: any) => (
                      <li key={p.id} className="flex items-center gap-2 text-xs text-slate-700 font-medium bg-slate-50 px-3 py-2 rounded-lg">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-6 h-6 rounded-md object-cover shrink-0" />
                        ) : (
                          <Package className="w-4 h-4 text-emerald-500 shrink-0" />
                        )}
                        <span className="line-clamp-1">{p.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                onClick={() => openModal(plan)}
                className="w-full py-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold rounded-xl transition-colors border border-slate-200 hover:border-emerald-200 flex items-center justify-center gap-2 text-sm"
              >
                <Edit className="w-4 h-4" />
                {isPriceZero ? "Configurar precio" : "Editar precio"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal precio */}
      {modalState.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Edit className="w-4 h-4 text-emerald-600" />
                  Precio — {modalState.plan.name.replace("Plan Senior ", "")}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Los cambios se sincronizarán con Stripe automáticamente.
                </p>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Precio (S/)
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="1"
                    defaultValue={modalState.plan.price}
                    required
                    className="w-full mt-1 border-b-2 border-slate-200 py-2 focus:border-emerald-500 focus:outline-none font-black text-xl text-slate-900 bg-transparent"
                    placeholder="89.00"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Frecuencia
                  </label>
                  <select
                    name="interval"
                    defaultValue={modalState.plan.interval}
                    className="w-full mt-1 border-b-2 border-slate-200 py-2 focus:border-emerald-500 focus:outline-none font-medium text-slate-900 bg-transparent text-sm"
                  >
                    <option value="monthly">Mensual (cada mes)</option>
                    <option value="bimonthly">Bimestral (cada 2 meses)</option>
                  </select>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center">
                Los productos se asignan desde <strong>Catálogo → Editar producto</strong>.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-colors disabled:opacity-50 text-sm"
              >
                {isSubmitting ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Sincronizando...</>
                ) : (
                  <><Save className="w-4 h-4" /> Guardar y Sincronizar</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}