"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quizSchema, QuizFormData } from "@/core/validators/quiz-schema";
import { processQuizSubmission } from "@/actions/quiz-actions";
import { saveFutureNotificationLead } from "@/actions/lead-actions";
import { AlertCircle, CheckCircle, Sparkles, ArrowRight, Mail, Layers } from "lucide-react";
import { StepEspecie } from "./StepEspecie";
import { StepDatos } from "./StepDatos";
import { StepSalud } from "./StepSalud";

const STEPS = ["Especie", "Datos", "Salud"];

export function QuizWizard() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [petPhotoUrl, setPetPhotoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [leadEmail, setLeadEmail] = useState("");
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: "",
  });

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: { name: "", breed: "", isMixed: false, healthConditions: [] } as any,
    mode: "onChange",
  });

  const nextStep = async () => {
    let valid = false;
    if (currentStep === 0) valid = await form.trigger("species");
    else if (currentStep === 1) valid = await form.trigger(["name", "ageYears", "weightKg"]);
    if (valid) setCurrentStep(p => p + 1);
  };

  const prevStep = () => setCurrentStep(p => p - 1);

  const onSubmit = async (data: QuizFormData) => {
    setIsSubmitting(true);
    const response = await processQuizSubmission(data, petPhotoUrl || undefined);
    setIsSubmitting(false);

    if (response.success && response.pet && response.recommendation) {
      setResult(response.recommendation);
    } else {
      setErrorModal({
        isOpen: true,
        message: response.error || "Ocurrió un problema al procesar el diagnóstico.",
      });
    }
  };

  const handleGoToPlans = () => {
    if (result?.exactPlanName) {
      router.push(`/planes?recommended=${encodeURIComponent(result.exactPlanName)}`);
    } else {
      router.push("/planes");
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = form.getValues();
    if (!leadEmail.trim()) return;
    
    setIsSubmitting(true);
    
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - Math.floor(values.ageYears || 0));

    const response = await saveFutureNotificationLead(
      leadEmail,
      values.name,
      values.species,
      birthDate.toISOString()
    );

    setIsSubmitting(false);
    if (response.success) setLeadSuccess(true);
    else setErrorModal({ isOpen: true, message: response.error || "Error guardando el correo." });
  };

  // ── Pantalla de carga ────────────────────────────────────────────────
  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 min-h-[420px] bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          <Sparkles className="w-8 h-8 text-emerald-600 absolute inset-0 m-auto" />
        </div>
        <p className="text-xl font-black text-slate-900 tracking-tight">Procesando diagnóstico...</p>
      </div>
    );
  }

  // ── Resultados ──────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-500/30">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tighter">¡Análisis Completado!</h2>
              <p className="text-slate-300 leading-relaxed max-w-lg mx-auto font-medium">{result.message}</p>
            </div>
          </div>

          {result.categories.length > 0 && (
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" /> Áreas de soporte recomendadas
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.categories.map((cat: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-emerald-900 font-bold text-xs">{cat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-8 space-y-5">
            {result.isEligibleForSubscription ? (
              <>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center shadow-inner">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Fórmula recomendada</p>
                  <p className="text-3xl font-black text-emerald-600 tracking-tighter mb-2">{result.exactPlanName}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    Incluye suplementos grado humano para su etapa. Recibe tu caja mensualmente.
                  </p>
                </div>
                <button onClick={handleGoToPlans}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 hover:-translate-y-1 active:scale-95">
                  <Layers className="w-4 h-4" /> Ver mi plan y suscribirme
                </button>
              </>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center space-y-5">
                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                  Tu mascota está en una excelente etapa preventiva. Te avisaremos cuando sea el momento exacto de iniciar su plan senior biológico.
                </p>
                {!leadSuccess ? (
                  <form onSubmit={handleLeadSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input type="email" value={leadEmail}
                      onChange={e => setLeadEmail(e.target.value)}
                      placeholder="Tu correo electrónico" required
                      className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-sm font-bold placeholder:text-slate-400" />
                    <button type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 shrink-0">
                      <Mail className="w-4 h-4" /> Avísame
                    </button>
                  </form>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl text-sm font-bold flex justify-center items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" /> ¡Correo registrado correctamente!
                  </div>
                )}
                <div className="pt-2">
                  <a href="/catalogo" className="inline-flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest hover:text-emerald-700 transition-colors">
                    Ver catálogo preventivo <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Formulario multi-paso ────────────────────────────────────────────
  return (
    <>
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
        {/* Barra de progreso */}
        <div className="flex justify-between items-center mb-12 relative px-2 sm:px-4">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10 rounded-full" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 -z-10 transition-all duration-500 rounded-full"
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} />
          {STEPS.map((step, index) => (
            <div key={step} className="flex flex-col items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 border-2 ${
                index < currentStep ? "bg-emerald-500 border-emerald-500 text-white"
                : index === currentStep ? "bg-white border-emerald-500 text-emerald-600 shadow-lg shadow-emerald-500/20 scale-110"
                : "bg-white border-slate-200 text-slate-300"
              }`}>
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : index + 1}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block transition-colors ${index <= currentStep ? "text-slate-900" : "text-slate-400"}`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-[340px] flex flex-col justify-between">
          <div>
            {currentStep === 0 && <StepEspecie form={form} />}
            {currentStep === 1 && <StepDatos form={form} petPhotoUrl={petPhotoUrl} setPetPhotoUrl={setPetPhotoUrl} />}
            {currentStep === 2 && <StepSalud form={form} />}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center mt-12 pt-8 border-t border-slate-100 gap-4">
            <button type="button" onClick={prevStep}
              className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 ${currentStep === 0 ? "invisible" : ""}`}>
              Volver
            </button>
            {currentStep < STEPS.length - 1 ? (
              <button type="button" onClick={nextStep}
                className="px-10 py-4 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2">
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit"
                className="px-10 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2">
                Finalizar Diagnóstico <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Modal Error */}
      {errorModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-red-500 bg-red-50 p-4 rounded-2xl"><AlertCircle className="w-8 h-8" /></div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Aviso del Sistema</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{errorModal.message}</p>
              <button onClick={() => setErrorModal({ isOpen: false, message: "" })}
                className="w-full py-4 mt-2 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-800 transition-all active:scale-95">
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}