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

  // Lead para mascotas jóvenes
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

  // ✅ CORRECCIÓN AQUÍ: Calculamos el birthDate y lo pasamos como string ISO
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = form.getValues();
    if (!leadEmail.trim()) return;
    
    setIsSubmitting(true);
    
    // Calculamos la fecha de nacimiento aproximada restando la edad actual
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - Math.floor(values.ageYears || 0));

    const response = await saveFutureNotificationLead(
      leadEmail,
      values.name,
      values.species,
      birthDate.toISOString() // <-- FIX: Convertimos a string ISO para TS
    );

    setIsSubmitting(false);
    if (response.success) setLeadSuccess(true);
    else setErrorModal({ isOpen: true, message: response.error || "Error guardando el correo." });
  };

  // ── Pantalla de carga ────────────────────────────────────────────────
  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 min-h-[420px] bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          <Sparkles className="w-8 h-8 text-emerald-600 absolute inset-0 m-auto" />
        </div>
        <p className="text-xl font-bold text-slate-900">Procesando información...</p>
      </div>
    );
  }

  // ── Resultados ──────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">¡Análisis Completado!</h2>
              <p className="text-slate-300 leading-relaxed max-w-lg mx-auto">{result.message}</p>
            </div>
          </div>

          {result.categories.length > 0 && (
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" /> Áreas de soporte recomendadas
              </h3>
              <div className="space-y-2">
                {result.categories.map((cat: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-slate-800 font-semibold text-sm">{cat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-8 space-y-4">
            {result.isEligibleForSubscription ? (
              <>
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">
                  <p className="text-xs text-emerald-700 font-medium mb-1">Plan recomendado para tu mascota</p>
                  <p className="text-2xl font-black text-emerald-900">{result.exactPlanName}</p>
                  <p className="text-xs text-emerald-600 mt-2">
                    Incluye suplementos formulados para su etapa de vida. Recibirás tu caja cada mes.
                  </p>
                </div>
                <button onClick={handleGoToPlans}
                  className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5">
                  <Layers className="w-5 h-5" />
                  Ver mi plan y suscribirme
                </button>
                <p className="text-xs text-slate-400 text-center">
                  Serás redirigido a la página de planes para confirmar tu suscripción.
                </p>
              </>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
                <p className="text-slate-600 font-medium text-sm">
                  Tu mascota está en una excelente etapa preventiva. Te avisaremos cuando sea el momento de iniciar su plan senior.
                </p>
                {!leadSuccess ? (
                  <form onSubmit={handleLeadSubmit} className="flex flex-col sm:flex-row gap-2">
                    <input type="email" value={leadEmail}
                      onChange={e => setLeadEmail(e.target.value)}
                      placeholder="Tu correo electrónico" required
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 text-sm" />
                    <button type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" /> Avísame
                    </button>
                  </form>
                ) : (
                  <div className="bg-emerald-100 text-emerald-800 p-3 rounded-xl text-sm font-bold flex justify-center items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> ¡Correo registrado!
                  </div>
                )}
                <a href="/catalogo" className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm hover:underline">
                  Ver catálogo preventivo <ArrowRight className="w-4 h-4" />
                </a>
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
      <div className="max-w-3xl mx-auto bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
        {/* Barra de progreso */}
        <div className="flex justify-between items-center mb-10 relative px-2 sm:px-0">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 -z-10 transition-all duration-500 rounded-full"
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} />
          {STEPS.map((step, index) => (
            <div key={step} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                index < currentStep ? "bg-emerald-600 border-emerald-600 text-white"
                : index === currentStep ? "bg-white border-emerald-600 text-emerald-600 shadow-md shadow-emerald-600/20"
                : "bg-white border-gray-200 text-gray-400"
              }`}>
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : index + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${index <= currentStep ? "text-emerald-600" : "text-gray-400"}`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-[320px]">
          {currentStep === 0 && <StepEspecie form={form} />}
          {currentStep === 1 && <StepDatos form={form} petPhotoUrl={petPhotoUrl} setPetPhotoUrl={setPetPhotoUrl} />}
          {currentStep === 2 && <StepSalud form={form} />}

          <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center mt-10 pt-6 border-t border-gray-100 gap-3">
            <button type="button" onClick={prevStep}
              className={`px-6 py-3 rounded-xl font-semibold transition-colors text-slate-600 bg-slate-100 hover:bg-slate-200 ${currentStep === 0 ? "invisible" : ""}`}>
              ← Atrás
            </button>
            {currentStep < STEPS.length - 1 ? (
              <button type="button" onClick={nextStep}
                className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20">
                Siguiente →
              </button>
            ) : (
              <button type="submit"
                className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md">
                Ver mis resultados ✓
              </button>
            )}
          </div>
        </form>
      </div>

      {errorModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl mx-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-red-500 bg-red-50 p-3 rounded-full"><AlertCircle className="w-8 h-8" /></div>
              <h3 className="text-xl font-bold text-slate-900">Aviso del Sistema</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{errorModal.message}</p>
              <button onClick={() => setErrorModal({ isOpen: false, message: "" })}
                className="w-full py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors">
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}