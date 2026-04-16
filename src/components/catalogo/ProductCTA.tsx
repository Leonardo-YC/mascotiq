"use client";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, ArrowRight, ChevronDown, Loader2, 
  AlertTriangle, CheckCircle2, LayoutDashboard 
} from "lucide-react";
import { createCheckoutSession } from "@/actions/checkout-action";

interface Pet {
  id: number;
  name: string;
  species: string;
  lifeStage: string | null;
  weightKg: string | null;
  activePlanId: number | null;
  activePlanProductIds: number[];
}

interface ValidPlan {
  planId: number;
  stripePriceId: string;
  planName: string;
  planPrice?: string;
}

function getExpectedPlanName(species: string, weightKgStr: string | null, lifeStage: string | null): string | null {
  if (lifeStage !== "senior") return null;
  const w = parseFloat(weightKgStr || "0");
  if (species === "cat") return "Plan Senior Gato";
  if (w < 10) return "Plan Senior Perro Pequeño";
  if (w < 25) return "Plan Senior Perro Mediano";
  if (w < 45) return "Plan Senior Perro Grande";
  return "Plan Senior Perro Gigante";
}

interface CompatResult {
  ok: boolean;
  alreadyHas?: boolean;
  message?: string;
}

function checkCompatibility(pet: Pet, productId: number, validPlans: ValidPlan[]): CompatResult {
  if (pet.activePlanProductIds.includes(productId)) {
    return {
      ok: false,
      alreadyHas: true,
      message: `${pet.name} ya recibe este producto en su plan activo.`,
    };
  }

  if (pet.lifeStage !== "senior") {
    return {
      ok: false,
      message: `${pet.name} aún no es senior. Cuando llegue a esa etapa podrás asignarle un plan.`,
    };
  }

  const expectedPlan = getExpectedPlanName(pet.species, pet.weightKg, pet.lifeStage);
  if (!expectedPlan) return { ok: false, message: "No se pudo determinar el plan correcto." };

  const productPlanNames = validPlans.map(vp => vp.planName);

  if (productPlanNames.includes(expectedPlan)) return { ok: true };

  const productIsForCat = productPlanNames.some(p => p.includes("Gato"));
  const productIsForDog = productPlanNames.some(p => p.includes("Perro"));

  if (pet.species === "dog" && productIsForCat) {
    return { ok: false, message: `Este producto es exclusivo para gatos. ${pet.name} necesita el ${expectedPlan}.` };
  }
  if (pet.species === "cat" && productIsForDog) {
    return { ok: false, message: `Este producto es exclusivo para perros. ${pet.name} necesita el ${expectedPlan}.` };
  }

  const w = parseFloat(pet.weightKg || "0").toFixed(1);
  return {
    ok: false,
    message: `${pet.name} (${w} kg) corresponde al ${expectedPlan}. Este producto es para otro tamaño.`,
  };
}

export function ProductCTA({
  productId,
  validPlans,
}: {
  productId: number;
  validPlans?: ValidPlan[];
}) {
  const { userId, isLoaded } = useAuth();
  const isSignedIn = !!userId;

  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [compatError, setCompatError] = useState<CompatResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    setLoadingPets(true);
    fetch("/api/my-pets")
      .then(r => r.json())
      .then(data => {
        setPets(data.pets || []);
        if (data.pets?.length > 0) setSelectedPetId(data.pets[0].id);
      })
      .catch(() => setPets([]))
      .finally(() => setLoadingPets(false));
  }, [isSignedIn]);

  useEffect(() => {
    setCompatError(null);
    if (!selectedPetId || !validPlans?.length) return;
    const pet = pets.find(p => p.id === selectedPetId);
    if (!pet) return;
    const result = checkCompatibility(pet, productId, validPlans);
    if (!result.ok) setCompatError(result);
  }, [selectedPetId, pets, validPlans, productId]);

  const handleCheckout = async () => {
    if (!selectedPetId || !validPlans?.length) return;
    const pet = pets.find(p => p.id === selectedPetId);
    if (!pet) return;

    const compat = checkCompatibility(pet, productId, validPlans);
    if (!compat.ok) { setCompatError(compat); return; }

    const expectedPlanName = getExpectedPlanName(pet.species, pet.weightKg, pet.lifeStage);
    const targetPlan = validPlans.find(vp => vp.planName === expectedPlanName) || validPlans[0];

    setIsRedirecting(true);
    setApiError(null);
    try {
      await createCheckoutSession(selectedPetId, targetPlan.stripePriceId);
    } catch (err: any) {
      if (!err?.message?.includes("NEXT_REDIRECT")) {
        setIsRedirecting(false);
        setApiError("No se pudo iniciar el proceso. Inténtalo de nuevo.");
      }
    }
  };

  const stageLabel = (stage: string | null) => {
    if (stage === "senior") return "🟠 Senior";
    if (stage === "adult") return "🔵 Adulto";
    return "🟢 Cachorro";
  };

  if (!isLoaded) return <div className="w-full h-12 bg-slate-100 rounded-xl animate-pulse" />;

  if (!isSignedIn) {
    return (
      <Link href="/sign-in"
        className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-emerald-500 transition-all shadow-md hover:-translate-y-0.5">
        <Activity className="w-4 h-4" /> Iniciar sesión para suscribirme
      </Link>
    );
  }

  if (loadingPets) {
    return (
      <div className="w-full h-12 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center gap-2 text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-xs font-medium">Cargando tus mascotas...</span>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="space-y-3">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium">
          Primero registra a tu mascota en el diagnóstico gratuito.
        </div>
        <Link href="/quiz" className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-emerald-500 transition-all">
          <Activity className="w-4 h-4" /> Hacer Diagnóstico Gratuito
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-1">
      <div>
        <label className="text-xs font-bold text-slate-700 mb-1.5 block">Elige la mascota que recibirá este plan:</label>
        <div className="relative">
          <select value={selectedPetId ?? ""}
            onChange={e => { setSelectedPetId(parseInt(e.target.value)); setApiError(null); }}
            className="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-900 focus:border-emerald-500 focus:outline-none transition-colors pr-8">
            {pets.map(pet => (
              <option key={pet.id} value={pet.id}>
                {pet.name} — {stageLabel(pet.lifeStage)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ── MEJORA: Botón de escape cuando ya tiene el producto ── */}
      {compatError?.alreadyHas && (
        <div className="flex flex-col gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 shadow-sm animate-in fade-in zoom-in-95">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] text-blue-900 font-black uppercase tracking-widest">Ya activo en tu plan</p>
              <p className="text-xs text-blue-700 mt-0.5 leading-relaxed font-medium">{compatError.message}</p>
            </div>
          </div>
          <Link 
            href="/dashboard" 
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 hover:bg-slate-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Gestionar mi suscripción actual
          </Link>
        </div>
      )}

      {compatError && !compatError.alreadyHas && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 font-medium leading-relaxed">{compatError.message}</p>
        </div>
      )}

      {apiError && (
        <p className="text-xs text-red-600 font-medium bg-red-50 border border-red-200 rounded-xl px-3 py-2">{apiError}</p>
      )}

      <button onClick={handleCheckout}
        disabled={isRedirecting || !selectedPetId || !!compatError || !validPlans?.length}
        className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-emerald-500 transition-all shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
        {isRedirecting ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Preparando...</>
        ) : (
          <><ArrowRight className="w-4 h-4" /> Obtener en mi Plan Mensual</>
        )}
      </button>

      <Link href="/quiz"
        className="w-full flex justify-center items-center gap-2 border border-slate-200 text-slate-500 py-2.5 rounded-xl font-bold text-xs hover:border-emerald-400 hover:text-emerald-600 transition-all">
        <Activity className="w-3.5 h-3.5" /> Registrar otra mascota
      </Link>
    </div>
  );
}