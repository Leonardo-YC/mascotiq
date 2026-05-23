"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers, CheckCircle2, Package, Activity, AlertTriangle,
  ChevronDown, Loader2, ArrowRight, Star, LogIn, Sparkles, X
} from "lucide-react";
import { createCheckoutSession } from "@/actions/checkout-action";

interface Pet {
  id: number;
  name: string;
  species: string;
  lifeStage: string | null;
  weightKg: string | null;
}

interface PlanProduct {
  id: number;
  name: string;
  description: string;
  subscriptionPrice: string;
  imageUrl: string | null;
}

interface Plan {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stripePriceId: string;
  interval: string;
  isActive: boolean;
  products: PlanProduct[];
}

interface CheckoutState {
  selectedPetId: number | null;
  isLoading: boolean;
  error: string | null;
  warned: boolean;
}

function getExpectedPlanName(species: string, weightKg: string | null, lifeStage: string | null): string | null {
  if (lifeStage !== "senior") return null;
  const w = parseFloat(weightKg || "0");
  if (species === "cat") return "Plan Senior Gato";
  if (w < 10) return "Plan Senior Perro Pequeño";
  if (w < 25) return "Plan Senior Perro Mediano";
  if (w < 45) return "Plan Senior Perro Grande";
  return "Plan Senior Perro Gigante";
}

export function PlanesPublicClient({
  plans,
  userPets,
  userActivePlanIds,
  petActivePlans,
  isLoggedIn,
  recommendedPlanName,
}: {
  plans: Plan[];
  userPets: Pet[];
  userActivePlanIds: number[];
  petActivePlans: { petId: number; planId: number }[];
  isLoggedIn: boolean;
  recommendedPlanName: string | null;
}) {
  const [checkoutStates, setCheckoutStates] = useState<Record<number, CheckoutState>>(() => {
    const initial: Record<number, CheckoutState> = {};
    plans.forEach(p => {
      initial[p.id] = { selectedPetId: null, isLoading: false, error: null, warned: false };
    });
    return initial;
  });

  useEffect(() => {
    if (!userPets.length) return;
    const updates: Record<number, Partial<CheckoutState>> = {};
    plans.forEach(plan => {
      const eligiblePets = userPets.filter(pet =>
        !petActivePlans.find(pa => pa.petId === pet.id && pa.planId === plan.id)
      );
      const bestMatch = eligiblePets.find(pet => getExpectedPlanName(pet.species, pet.weightKg, pet.lifeStage) === plan.name);
      updates[plan.id] = {
        selectedPetId: (bestMatch || eligiblePets[0])?.id || null,
        isLoading: false,
        error: null,
        warned: false,
      };
    });
    setCheckoutStates(prev => {
      const merged: Record<number, CheckoutState> = { ...prev };
      Object.keys(updates).forEach(k => {
        const planId = parseInt(k);
        merged[planId] = { ...prev[planId], ...updates[planId] };
      });
      return merged;
    });
  }, [userPets, plans, petActivePlans]);

  useEffect(() => {
    if (recommendedPlanName) {
      const el = document.getElementById(`plan-${recommendedPlanName.replace(/\s+/g, "-")}`);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 400);
    }
  }, [recommendedPlanName]);

  const updateState = (planId: number, updates: Partial<CheckoutState>) => {
    setCheckoutStates(prev => ({ ...prev, [planId]: { ...prev[planId], ...updates } }));
  };

  const handleSubscribe = async (plan: Plan) => {
    const state = checkoutStates[plan.id];
    if (!state.selectedPetId) return;
    const pet = userPets.find(p => p.id === state.selectedPetId);
    if (!pet) return;
    const expectedPlan = getExpectedPlanName(pet.species, pet.weightKg, pet.lifeStage);
    if (pet.lifeStage !== "senior") {
      updateState(plan.id, { error: `${pet.name} aún no es senior. El sistema te avisará cuando sea el momento.` });
      return;
    }
    if (expectedPlan && expectedPlan !== plan.name && !state.warned) {
      updateState(plan.id, {
        error: `⚠️ Diagnóstico: ${pet.name} corresponde al ${expectedPlan}. ¿Deseas continuar con este plan igualmente?`,
        warned: true,
      });
      return;
    }
    updateState(plan.id, { isLoading: true, error: null });
    try {
      await createCheckoutSession(state.selectedPetId, plan.stripePriceId);
    } catch (err: unknown) {
      const error = err as { message?: string };
      if (!error?.message?.includes("NEXT_REDIRECT")) {
        updateState(plan.id, { isLoading: false, error: "Error al iniciar pago. Reintenta." });
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-20">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
            <Layers className="w-3.5 h-3.5" /> Suscripción Nutricional
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">Planes Senior</h1>
          <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
            Fórmulas biológicas automáticas. Recibe una caja personalizada cada mes, diseñada para la etapa real de tu mascota.
          </p>
          {recommendedPlanName && (
            <div className="mt-8 inline-flex items-center gap-3 bg-slate-900 px-6 py-3 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-2">
              <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span className="text-white font-bold text-sm tracking-tight">
                Plan recomendado: <span className="text-emerald-400">{recommendedPlanName}</span>
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <div className="bg-emerald-600 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-emerald-600/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/20 p-3 rounded-2xl shadow-inner">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">¿Dudas sobre el plan ideal?</p>
              <p className="text-emerald-100 text-sm font-medium">Realiza el diagnóstico gratuito (3 min) para asignar la fórmula correcta.</p>
            </div>
          </div>
          <Link href="/quiz" className="bg-white text-emerald-700 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg active:scale-95 shrink-0 relative z-10">
            Iniciar Diagnóstico
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map(plan => {
            const isRecommended = recommendedPlanName === plan.name;
            const isZero = parseFloat(plan.price) === 0;
            const state = checkoutStates[plan.id];
            const eligiblePets = userPets.filter(pet =>
              !petActivePlans.find(pa => pa.petId === pet.id && pa.planId === plan.id)
            );
            const allPetsAlreadySubscribed = isLoggedIn && userPets.length > 0 && eligiblePets.length === 0;

            return (
              <div key={plan.id}
                id={`plan-${plan.name.replace(/\s+/g, "-")}`}
                className={`bg-white rounded-[2.5rem] border shadow-sm flex flex-col relative overflow-hidden transition-all duration-500 ${
                  isRecommended
                    ? "border-emerald-500 shadow-2xl scale-[1.02] z-20"
                    : "border-slate-100 hover:border-emerald-200"
                }`}>
                {isRecommended && (
                  <div className="bg-emerald-500 text-white text-[10px] font-black text-center py-2 tracking-[0.2em] uppercase">
                    ⭐ Selección Inteligente
                  </div>
                )}
                <div className="p-8 md:p-10 flex flex-col h-full">
                  <div className="mb-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {plan.interval === "monthly" ? "Mensual" : "Bimestral"}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mt-2 mb-2 leading-tight">{plan.name}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{plan.description}</p>
                  </div>
                  <div className="mb-8">
                    {isZero ? (
                      <p className="text-xl font-black text-amber-500 uppercase tracking-widest">Coming Soon</p>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-bold text-emerald-600">S/</span>
                        <span className="text-5xl font-black text-emerald-600 tracking-tighter">{plan.price}</span>
                        <span className="text-slate-400 font-bold text-sm">/mes</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 mb-8">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-5 border-b border-slate-100 pb-2">
                      Fórmulas Incluidas:
                    </p>
                    <ul className="space-y-3">
                      {plan.products.map((p) => (
                        <li key={p.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.name} className="w-full h-full rounded-xl object-cover" />
                            ) : (
                              <Package className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                          <p className="text-xs font-bold text-slate-700 leading-tight">{p.name}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto space-y-3">
                    {state?.error && (
                      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-[11px] text-amber-800 font-bold leading-tight">{state.error}</p>
                          {state.warned && (
                            <button onClick={() => handleSubscribe(plan)} className="text-[11px] text-amber-700 underline mt-2 font-black uppercase tracking-widest">
                              Confirmar Igualmente
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    {!isLoggedIn ? (
                      <Link href="/sign-in" className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                        <LogIn className="w-4 h-4" /> Entrar para suscribirme
                      </Link>
                    ) : userPets.length === 0 ? (
                      <Link href="/quiz" className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20">
                        <Activity className="w-4 h-4" /> Registrar Mascota
                      </Link>
                    ) : allPetsAlreadySubscribed ? (
                      <div className="w-full py-4 bg-blue-50 text-blue-700 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center border border-blue-100">
                        ✓ Suscripción Activa
                      </div>
                    ) : !isZero ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <select
                            value={state?.selectedPetId ?? ""}
                            onChange={e => updateState(plan.id, { selectedPetId: parseInt(e.target.value), error: null, warned: false })}
                            className="w-full appearance-none bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 text-xs font-black text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all pr-10 cursor-pointer"
                          >
                            {eligiblePets.map(pet => (
                              <option key={pet.id} value={pet.id}>{pet.name} — {pet.lifeStage?.toUpperCase()}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                        <button onClick={() => handleSubscribe(plan)} disabled={state?.isLoading}
                          className={`w-full flex items-center justify-center gap-2 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95 ${
                            isRecommended ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20" : "bg-slate-900 text-white hover:bg-slate-800"
                          }`}
                        >
                          {state?.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Activar Plan</>}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}