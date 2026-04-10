import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans">
      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
      <h2 className="text-lg font-bold text-slate-900 tracking-tight">Cargando...</h2>
      <p className="text-sm text-slate-500 font-medium">Preparando la información de Mascotiq</p>
    </div>
  );
}