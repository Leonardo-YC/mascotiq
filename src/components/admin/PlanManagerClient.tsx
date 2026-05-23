"use client";
import { useRouter } from "next/navigation";
import { Edit, Package, Save, X, RefreshCw, Layers, AlertTriangle, CheckCircle2, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { updatePlanPrice } from "@/actions/plan-actions";

function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export interface AdminPlan {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stripePriceId: string;
  stripeProductId: string | null;
  interval: string;
  isActive: boolean;
}

export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  ingredients: string | null;
  price: string;
  subscriptionPrice: string;
  imageUrl: string | null;
  isActive: boolean;
  categoryId: number | null;
}

export interface AdminPlanProduct {
  id: number;
  planId: number;
  productId: number;
}

export function PlanManagerClient({
  initialPlans,
  availableProducts,
  currentRelations,
}: {
  initialPlans: AdminPlan[];
  availableProducts: AdminProduct[];
  currentRelations: AdminPlanProduct[];
}) {
  const router = useRouter();
  const plans = initialPlans;
  const [modalState, setModalState] = useState<{ isOpen: boolean; plan: AdminPlan | null }>({
    isOpen: false,
    plan: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  useEffect(() => {
    if (modalState.isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [modalState.isOpen]);

  const openModal = (plan: AdminPlan) => setModalState({ isOpen: true, plan });
  const closeModal = () => setModalState({ isOpen: false, plan: null });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modalState.plan) return;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const newPrice = parseFloat(formData.get("price") as string);
    const interval = formData.get("interval") as "monthly" | "bimonthly";
    await updatePlanPrice(modalState.plan.id, modalState.plan.name, newPrice, interval);
    setIsSubmitting(false);
    closeModal();
    setSuccessBanner(true);
    setTimeout(() => setSuccessBanner(false), 4000);
    router.refresh();
  };

  return (
    <>
      {successBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top-4 shadow-sm mb-6">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          Plan actualizado y sincronizado con Stripe correctamente.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
        {plans.map((plan) => {
          const planProductsList = currentRelations
            .filter((r) => r.planId === plan.id)
            .map((r) => availableProducts.find((p) => p.id === r.productId))
            .filter((p): p is AdminProduct => p !== undefined);

          const isPriceZero = parseFloat(plan.price) === 0;

          return (
            <div key={plan.id} className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col group transition-shadow">
              <div className="flex justify-between items-start mb-5 md:mb-6">
                <div className="bg-emerald-50 p-3 sm:p-4 rounded-2xl border border-emerald-100 shrink-0">
                  <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="bg-slate-100 text-slate-500 text-[9px] sm:text-[10px] font-black px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate-200 uppercase tracking-widest">
                    {plan.interval === "monthly" ? "Mensual" : "Bimestral"}
                  </span>
                  {isPriceZero && (
                    <span className="bg-amber-50 text-amber-700 text-[9px] sm:text-[10px] font-black px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-amber-200 flex items-center gap-1 uppercase tracking-widest">
                      <AlertTriangle className="w-3 h-3" /> Sin precio
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1 tracking-tight leading-tight">{plan.name}</h3>
              <p className={`text-3xl sm:text-4xl font-black mb-3 tracking-tighter ${isPriceZero ? "text-amber-500" : "text-emerald-600"}`}>
                {isPriceZero ? "N/A" : `S/ ${plan.price}`}
                {!isPriceZero && <span className="text-xs sm:text-sm text-slate-400 font-bold ml-1 tracking-normal">/mes</span>}
              </p>
              {plan.description && (
                <p className="text-xs sm:text-sm text-slate-500 font-medium mb-5 md:mb-6 leading-relaxed line-clamp-2">{plan.description}</p>
              )}
              <div className="flex-1 mb-6 md:mb-8">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5" /> Incluye ({planProductsList.length})
                </p>
                {planProductsList.length === 0 ? (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 text-center">
                    <p className="text-xs text-slate-400 font-bold">Asígnalos desde el Catálogo</p>
                  </div>
                ) : (
                  <ul className="space-y-2 md:space-y-2.5">
                    {planProductsList.map((p) => (
                      <li key={p.id} className="flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs text-slate-700 font-bold bg-slate-50 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl border border-slate-100">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover shrink-0 shadow-sm" />
                        ) : (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                          </div>
                        )}
                        <span className="line-clamp-1">{p.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={() => openModal(plan)}
                className="w-full py-3.5 sm:py-4 bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-2xl transition-colors border border-slate-200 hover:border-slate-900 flex items-center justify-center gap-2"
              >
                <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {isPriceZero ? "Configurar Precio" : "Editar Precio"}
              </button>
            </div>
          );
        })}
      </div>

      {modalState.isOpen && modalState.plan && (
        <Portal>
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={closeModal}
          >
            <div
              className="bg-white w-full max-w-md rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-100"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-5 md:p-6 border-b border-slate-100 bg-white flex justify-between items-start">
                <div>
                  <h3 className="text-base md:text-lg font-black text-slate-900 flex items-center gap-2 tracking-tight">
                    <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600">
                      <Edit className="w-4 h-4" />
                    </div>
                    Precio — {modalState.plan.name.replace("Plan Senior ", "")}
                  </h3>
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">
                    Los cambios se sincronizarán con Stripe.
                  </p>
                </div>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5 md:space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-100">
                  <div className="flex-1 flex flex-col justify-end">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Precio (S/)
                    </label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      min="1"
                      defaultValue={modalState.plan.price}
                      required
                      placeholder="89.00"
                      className="h-12 w-full mt-1 md:mt-2 border-b-2 border-slate-200 px-2 focus:border-emerald-500 focus:outline-none font-black text-lg md:text-xl text-slate-900 bg-transparent transition-colors"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-end">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Frecuencia
                    </label>
                    <div className="relative mt-1 md:mt-2">
                      <select
                        name="interval"
                        defaultValue={modalState.plan.interval}
                        className="h-12 w-full appearance-none border-b-2 border-slate-200 pl-2 pr-8 focus:border-emerald-500 focus:outline-none font-bold text-slate-700 bg-transparent text-sm transition-colors cursor-pointer"
                      >
                        <option value="monthly">Mensual</option>
                        <option value="bimonthly">Bimestral</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="text-center bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-500 tracking-wider">
                    Asigna productos desde el <strong className="text-slate-700 uppercase">Catálogo</strong>.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] md:text-xs uppercase tracking-widest py-3.5 md:py-4 rounded-xl md:rounded-2xl flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Procesando...</>
                  ) : (
                    <><Save className="w-4 h-4" /> Guardar y Sincronizar</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}