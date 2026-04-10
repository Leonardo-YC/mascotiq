"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers, CheckCircle2, Package, Activity, AlertTriangle,
  ChevronDown, Loader2, ArrowRight, Star, LogIn, Info, X
} from "lucide-react";
import { createCheckoutSession } from "@/actions/checkout-action";

interface Pet {
  id: number;
  name: string;
  species: string;
  lifeStage: string | null;
  weightKg: string | null;
}

interface Plan {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stripePriceId: string;
  interval: string;
  isActive: boolean;
  products: {
    id: number;
    name: string;
    description: string;
    subscriptionPrice: string;
    imageUrl: string | null;
  }[];
}

// Determina el plan biológico correcto para una mascota
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
  // Estado de checkout por plan
  const [checkoutStates, setCheckoutStates] = useState<
    Record<number, { selectedPetId: number | null; isLoading: boolean; error: string | null; warned: boolean }>
  >(() => {
    const initial: Record<number, any> = {};
    plans.forEach(p => {
      initial[p.id] = { selectedPetId: null, isLoading: false, error: null, warned: false };
    });
    return initial;
  });

  // Inicializar mascota seleccionada por plan según compatibilidad biológica
  useEffect(() => {
    if (!userPets.length) return;
    const updates: Record<number, any> = {};
    plans.forEach(plan => {
      // Mascotas que NO tienen ya este plan activo
      const eligiblePets = userPets.filter(pet =>
        !petActivePlans.find(pa => pa.petId === pet.id && pa.planId === plan.id)
      );
      // Priorizar la mascota cuyo plan esperado coincide con este plan
      const bestMatch = eligiblePets.find(pet => getExpectedPlanName(pet.species, pet.weightKg, pet.lifeStage) === plan.name);
      updates[plan.id] = {
        selectedPetId: (bestMatch || eligiblePets[0])?.id || null,
        isLoading: false,
        error: null,
        warned: false,
      };
    });
    setCheckoutStates(prev => {
      const merged: Record<number, any> = { ...prev };
      Object.keys(updates).forEach(k => {
        const planId = parseInt(k);
        merged[planId] = { ...prev[planId], ...updates[planId] };
      });
      return merged;
    });
  }, [userPets, plans, petActivePlans]);

  // Scroll al plan recomendado
  useEffect(() => {
    if (recommendedPlanName) {
      const el = document.getElementById(`plan-${recommendedPlanName.replace(/\s+/g, "-")}`);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 400);
    }
  }, [recommendedPlanName]);

  const updateState = (planId: number, updates: Partial<typeof checkoutStates[0]>) => {
    setCheckoutStates(prev => ({ ...prev, [planId]: { ...prev[planId], ...updates } }));
  };

  const handleSubscribe = async (plan: Plan) => {
    const state = checkoutStates[plan.id];
    if (!state.selectedPetId) return;
    if (parseFloat(plan.price) === 0) {
      updateState(plan.id, { error: "Este plan aún no tiene precio configurado." });
      return;
    }

    const pet = userPets.find(p => p.id === state.selectedPetId);
    if (!pet) return;

    // Verificar compatibilidad biológica
    const expectedPlan = getExpectedPlanName(pet.species, pet.weightKg, pet.lifeStage);

    if (pet.lifeStage !== "senior") {
      updateState(plan.id, { error: `${pet.name} aún no es senior. El quiz te avisará cuando sea el momento.` });
      return;
    }

    if (expectedPlan && expectedPlan !== plan.name && !state.warned) {
      // Primera vez: mostrar advertencia pero permitir continuar
      updateState(plan.id, {
        error: `⚠️ Según el diagnóstico, ${pet.name} corresponde al ${expectedPlan}. Puedes suscribirte a este plan bajo tu criterio, pero podría no ser el óptimo. Confirma de nuevo para continuar.`,
        warned: true,
      });
      return;
    }

    updateState(plan.id, { isLoading: true, error: null });
    try {
      await createCheckoutSession(state.selectedPetId, plan.stripePriceId);
    } catch (err: any) {
      if (!err?.message?.includes("NEXT_REDIRECT")) {
        updateState(plan.id, { isLoading: false, error: "No se pudo iniciar el pago. Intenta de nuevo." });
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      {/* Cabecera */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 text-emerald-800 text-sm font-bold mb-5 border border-emerald-200">
            <Layers className="w-4 h-4" /> Nutrición por Etapa de Vida
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Nuestros Planes</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Cada plan incluye una caja mensual con todos los suplementos formulados para tu mascota.
            Pagas el plan y los recibes automáticamente. Sin compras individuales.
          </p>
          {recommendedPlanName && (
            <div className="mt-6 inline-flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-5 py-3 rounded-2xl">
              <Star className="w-5 h-5 text-emerald-600 fill-emerald-600" />
              <span className="text-emerald-800 font-bold text-sm">
                El quiz recomienda: <strong>{recommendedPlanName}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Banner advisory */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 font-medium">
            <strong>¿No hiciste el diagnóstico aún?</strong>{" "}
            <Link href="/quiz" className="underline hover:text-blue-600">Es gratis y toma 3 minutos</Link>{" "}
            — el sistema asignará el plan correcto automáticamente.
            También puedes suscribirte directamente desde aquí.
          </p>
        </div>
      </div>

      {/* Grid de planes */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => {
            const isRecommended = recommendedPlanName === plan.name;
            const isZero = parseFloat(plan.price) === 0;
            const state = checkoutStates[plan.id];

            // Mascotas que ya tienen este plan activo
            const petsAlreadyOnThisPlan = petActivePlans
              .filter(pa => pa.planId === plan.id)
              .map(pa => userPets.find(p => p.id === pa.petId))
              .filter(Boolean);

            // Mascotas elegibles para este plan (las que NO lo tienen ya)
            const eligiblePets = userPets.filter(pet =>
              !petActivePlans.find(pa => pa.petId === pet.id && pa.planId === plan.id)
            );

            const allPetsAlreadySubscribed =
              isLoggedIn && userPets.length > 0 && eligiblePets.length === 0;

            return (
              <div key={plan.id}
                id={`plan-${plan.name.replace(/\s+/g, "-")}`}
                className={`bg-white rounded-3xl border-2 shadow-sm flex flex-col relative overflow-hidden transition-all duration-300 ${
                  isRecommended
                    ? "border-emerald-500 shadow-emerald-100 shadow-lg"
                    : "border-slate-200 hover:border-emerald-300 hover:-translate-y-1"
                }`}>

                {isRecommended && (
                  <div className="bg-emerald-500 text-white text-[10px] font-black text-center py-1.5 tracking-widest uppercase">
                    ⭐ Recomendado por tu diagnóstico
                  </div>
                )}

                {allPetsAlreadySubscribed && !isRecommended && (
                  <div className="bg-blue-500 text-white text-[10px] font-black text-center py-1.5 tracking-widest uppercase">
                    ✓ Todas tus mascotas ya tienen este plan
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Cabecera */}
                  <div className="mb-4">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 uppercase">
                      {plan.interval === "monthly" ? "Cobro mensual" : "Cobro bimestral"}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-3 mb-1">{plan.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{plan.description}</p>
                  </div>

                  {/* Precio */}
                  <div className="mb-5">
                    {isZero ? (
                      <p className="text-2xl font-black text-amber-500">Próximamente</p>
                    ) : (
                      <p className="text-4xl font-black text-emerald-600">
                        S/ {plan.price}
                        <span className="text-base text-slate-400 font-medium"> /mes</span>
                      </p>
                    )}
                  </div>

                  {/* Productos */}
                  <div className="flex-1 mb-5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">
                      Tu caja mensual incluye:
                    </p>
                    {plan.products.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Productos en formulación</p>
                    ) : (
                      <ul className="space-y-2">
                        {plan.products.map((p: any) => (
                          <li key={p.id} className="flex items-center gap-2.5">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.name} className="w-7 h-7 rounded-lg object-cover border border-slate-100 shrink-0" />
                            ) : (
                              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                <Package className="w-3.5 h-3.5 text-slate-400" />
                              </div>
                            )}
                            <p className="text-xs font-semibold text-slate-700 leading-tight line-clamp-1">{p.name}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Mascotas que ya tienen este plan */}
                  {petsAlreadyOnThisPlan.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {(petsAlreadyOnThisPlan as Pet[]).map(pet => (
                        <span key={pet.id} className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> {pet.name} — activo
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-auto space-y-2">
                    {state?.error && (
                      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-[10px] text-amber-800 font-medium leading-relaxed">{state.error}</p>
                          {state.warned && (
                            <button onClick={() => updateState(plan.id, { error: null })}
                              className="text-[10px] text-amber-700 underline mt-1 font-bold">
                              Confirmar igualmente
                            </button>
                          )}
                        </div>
                        <button onClick={() => updateState(plan.id, { error: null, warned: false })}>
                          <X className="w-3.5 h-3.5 text-amber-400 hover:text-amber-600" />
                        </button>
                      </div>
                    )}

                    {/* No logueado */}
                    {!isLoggedIn && (
                      <>
                        <Link href="/sign-in"
                          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm transition-all">
                          <LogIn className="w-4 h-4" /> Iniciar sesión para suscribirme
                        </Link>
                        <Link href="/quiz"
                          className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-500 py-2.5 rounded-xl font-bold text-xs hover:border-emerald-400 hover:text-emerald-600 transition-all">
                          <Activity className="w-3.5 h-3.5" /> Hacer diagnóstico primero
                        </Link>
                      </>
                    )}

                    {/* Logueado sin mascotas */}
                    {isLoggedIn && userPets.length === 0 && (
                      <>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium">
                          Registra a tu mascota con el diagnóstico gratuito antes de suscribirte.
                        </div>
                        <Link href="/quiz"
                          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition-all">
                          <Activity className="w-4 h-4" /> Hacer diagnóstico gratuito
                        </Link>
                      </>
                    )}

                    {/* Todas las mascotas ya tienen este plan */}
                    {isLoggedIn && userPets.length > 0 && allPetsAlreadySubscribed && (
                      <div className="w-full flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 py-3 rounded-xl font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4" /> Todas tus mascotas ya tienen este plan
                      </div>
                    )}

                    {/* Tiene mascotas elegibles */}
                    {isLoggedIn && eligiblePets.length > 0 && !isZero && (
                      <>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                            Para cuál de tus mascotas
                          </label>
                          <div className="relative">
                            <select
                              value={state?.selectedPetId ?? ""}
                              onChange={e => updateState(plan.id, { selectedPetId: parseInt(e.target.value), error: null, warned: false })}
                              className="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:outline-none pr-7">
                              {eligiblePets.map(pet => (
                                <option key={pet.id} value={pet.id}>
                                  {pet.name} — {pet.lifeStage === "senior" ? "🟠 Senior" : pet.lifeStage === "adult" ? "🔵 Adulto" : "🟢 Cachorro"}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        <button onClick={() => handleSubscribe(plan)}
                          disabled={state?.isLoading || !state?.selectedPetId}
                          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                            isRecommended
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                              : "bg-slate-900 hover:bg-slate-800 text-white"
                          }`}>
                          {state?.isLoading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Preparando...</>
                          ) : (
                            <><ArrowRight className="w-4 h-4" /> Suscribirme a este plan</>
                          )}
                        </button>
                      </>
                    )}

                    {/* Plan sin precio */}
                    {isLoggedIn && eligiblePets.length > 0 && isZero && (
                      <div className="w-full flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 py-3 rounded-xl font-bold text-sm">
                        Precio no configurado aún
                      </div>
                    )}
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