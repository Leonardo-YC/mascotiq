'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Revisamos si el usuario ya aceptó las cookies antes
    const consent = localStorage.getItem("mascotiq_cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("mascotiq_cookie_consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom-5 font-sans pointer-events-none">
      <div className="max-w-5xl mx-auto bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto border border-slate-700/50">
        
        {/* Contenido y Texto */}
        <div className="flex items-start md:items-center gap-4 w-full">
          <div className="bg-slate-800/50 p-3 rounded-2xl hidden sm:flex shrink-0 border border-slate-700">
            <Cookie className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-100 mb-1">Valoramos tu privacidad</h4>
            <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
              Utilizamos cookies esenciales para el correcto funcionamiento de Mascotiq y analíticas anónimas para mejorar tu experiencia. Al continuar navegando, aceptas nuestro uso de cookies. Lee más detalles en nuestra{" "}
              <Link 
                href="/privacidad" 
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 font-medium transition-colors"
                onClick={() => setIsVisible(false)} // Si van a leer la política, ocultamos el banner
              >
                Política de Privacidad
              </Link>.
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end md:justify-start">
          <button 
            onClick={handleAccept}
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95 text-sm"
          >
            Aceptar y continuar
          </button>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors hidden md:flex outline-none focus:outline-none focus:ring-0"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}