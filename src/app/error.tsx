'use client';

import { useEffect } from "react";
import { ServerCrash, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aquí podríamos conectar a Sentry o algún servicio de logs en el futuro
    console.error("Error capturado por la barrera global:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 font-sans text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <ServerCrash className="w-10 h-10 text-red-500" />
      </div>
      
      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
        Algo no salió como esperábamos
      </h2>
      
      <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        Tuvimos un problema técnico procesando tu solicitud. Nuestro equipo ya ha sido notificado.
      </p>

      <button
        onClick={() => reset()}
        className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-colors"
      >
        <RefreshCcw className="w-5 h-5" />
        Intentar nuevamente
      </button>
    </div>
  );
}