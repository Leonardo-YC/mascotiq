"use client";

import { UseFormReturn } from "react-hook-form";
import { QuizFormData } from "@/core/validators/quiz-schema";
import { ImageUpload } from "./ImageUpload";
import { Info } from "lucide-react";

interface StepDatosProps {
  form: UseFormReturn<QuizFormData>;
  petPhotoUrl: string;
  setPetPhotoUrl: (url: string) => void;
}

export function StepDatos({ form, petPhotoUrl, setPetPhotoUrl }: StepDatosProps) {
  const isDog = form.watch("species") === "dog";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Cuéntanos sobre tu peludo</h2>
        <p className="text-slate-500 font-medium">Estos datos calcularán su etapa biológica exacta.</p>
      </div>

      {/* Subida de Imagen */}
      <div className="mb-10">
        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
          Sube una foto de su carita (Opcional)
        </p>
        <ImageUpload value={petPhotoUrl} onChange={setPetPhotoUrl} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Nombre */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
          <input
            {...form.register("name")}
            type="text"
            placeholder="Ej: Max, Luna..."
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 focus:outline-none text-slate-900 text-sm font-bold transition-all placeholder:text-slate-300"
          />
          {form.formState.errors.name && <p className="text-red-500 text-xs font-bold ml-1">{form.formState.errors.name.message}</p>}
        </div>

        {/* Edad */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Edad (Años)</label>
          <input
            {...form.register("ageYears", { valueAsNumber: true })}
            type="number"
            min="0" step="0.5"
            placeholder="Ej: 5"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 focus:outline-none text-slate-900 text-sm font-bold transition-all placeholder:text-slate-300"
          />
          {form.formState.errors.ageYears && <p className="text-red-500 text-xs font-bold ml-1">{form.formState.errors.ageYears.message}</p>}
        </div>

        {/* Peso */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Peso (Kg)</label>
          <input
            {...form.register("weightKg", { valueAsNumber: true })}
            type="number"
            min="0.1" step="0.1"
            placeholder="Ej: 12.5"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 focus:outline-none text-slate-900 text-sm font-bold transition-all placeholder:text-slate-300"
          />
          {form.formState.errors.weightKg && <p className="text-red-500 text-xs font-bold ml-1">{form.formState.errors.weightKg.message}</p>}
        </div>

        {/* Raza */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Raza (Opcional)</label>
          <input
            {...form.register("breed")}
            type="text"
            placeholder={isDog ? "Ej: Schnauzer" : "Ej: Siamés"}
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 focus:outline-none text-slate-900 text-sm font-bold transition-all placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* Switch de Mestizo */}
      <div className="max-w-2xl mx-auto mt-6 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 flex items-start gap-4 transition-colors hover:bg-emerald-50 cursor-pointer" 
           onClick={() => form.setValue("isMixed", !form.getValues("isMixed"))}>
        <div className="pt-0.5">
          <input
            {...form.register("isMixed")}
            type="checkbox"
            className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div>
          <label className="font-bold text-slate-900 cursor-pointer select-none">Mi mascota es cruzada / mestiza</label>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium select-none">
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            Usaremos su peso para categorizar su tamaño con precisión médica.
          </p>
        </div>
      </div>
    </div>
  );
}