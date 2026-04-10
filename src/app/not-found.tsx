"use client"

import Link from "next/link";
import { SearchX, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 max-w-md text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <SearchX className="w-10 h-10 text-slate-400" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
          Página no encontrada
        </h1>
        
        <p className="text-slate-500 mb-8 leading-relaxed">
          Ups. Parece que te has perdido buscando la comida. La página que intentas visitar no existe o fue movida.
        </p>

        <div className="flex flex-col gap-3">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            Volver al Inicio
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 px-6 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
}