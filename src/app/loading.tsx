import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="h-[80vh] w-full flex flex-col items-center justify-center font-sans animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        <div className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
      </div>
      <h2 className="text-xl font-black text-slate-900 tracking-tight mt-6">Cargando...</h2>
      <p className="text-sm text-slate-500 font-medium mt-1">Preparando la experiencia Mascotiq</p>
    </div>
  );
}