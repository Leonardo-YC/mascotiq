import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, HeartPulse } from "lucide-react";

// FIX: Leemos redirect_url de los searchParams para que el flujo
// visitante → quiz → sign-up → quiz funcione correctamente.
// Si el visitante llegó desde el quiz (con ?redirect_url=/quiz),
// Clerk lo mandará de vuelta al quiz tras registrarse y el
// useEffect de QuizWizard procesará los datos pendientes.
export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const resolved = await searchParams;
  const redirectUrl = resolved.redirect_url || "/dashboard";

  return (
    <main className="min-h-screen flex font-sans">

      {/* LADO IZQUIERDO: Branding (solo desktop) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden border-r border-slate-800">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-colors mb-16 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <div className="flex items-center gap-4 mb-10">
            <Image src="/logo.svg" alt="Mascotiq Logo" width={56} height={56} className="w-14 h-14" />
            <span className="text-4xl font-black text-white tracking-tighter">Mascotiq</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.15] mb-6">
            Elige la ciencia. <br />
            <span className="text-emerald-400">Alarga su vida.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Crea tu cuenta en segundos para obtener un diagnóstico nutricional preciso, gratis y personalizado para la etapa biológica de tu mascota.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-slate-400 bg-slate-800/50 p-4 rounded-2xl w-max border border-slate-700/50">
          <HeartPulse className="w-6 h-6 text-emerald-500" />
          <p className="font-medium text-sm">Únete a más de 500 familias felices</p>
        </div>
      </div>

      {/* LADO DERECHO: Formulario Clerk */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-slate-50 relative p-6">

        {/* Botón y Logo solo en móvil */}
        <Link
          href="/"
          className="lg:hidden absolute top-6 left-6 inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-colors text-sm bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
        <div className="lg:hidden flex flex-col items-center mb-8 mt-12">
          <Image src="/logo.svg" alt="Mascotiq Logo" width={72} height={72} className="w-16 h-16 mb-3 drop-shadow-sm" />
          <span className="text-2xl font-black text-slate-900 tracking-tighter">Mascotiq</span>
        </div>

        {/* Formulario de Clerk con redirect dinámico */}
        <div className="w-full flex justify-center">
          <SignUp fallbackRedirectUrl={redirectUrl} />
        </div>
      </div>
    </main>
  );
}