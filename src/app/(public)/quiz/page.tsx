import { QuizWizard } from "@/components/quiz/QuizWizard";

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Encabezado Boutique */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter leading-tight">
            Descubre la etapa real de tu mascota
          </h1>
          <p className="text-base md:text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Completa este breve diagnóstico y obtén un plan nutricional personalizado basado en biología pura.
          </p>
        </div>
        
        <QuizWizard />

      </div>
    </main>
  );
}