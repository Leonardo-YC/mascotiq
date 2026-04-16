"use client";

import { UseFormReturn } from "react-hook-form";
import { QuizFormData } from "@/core/validators/quiz-schema";
import { Cat, Dog } from "lucide-react";

interface StepEspecieProps {
  form: UseFormReturn<QuizFormData>;
}

export function StepEspecie({ form }: StepEspecieProps) {
  const selectedSpecies = form.watch("species");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">¿A quién vamos a cuidar hoy?</h2>
        <p className="text-slate-500 font-medium">Selecciona la especie de tu compañero</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto">
        <button
          type="button"
          onClick={() => form.setValue("species", "dog", { shouldValidate: true })}
          className={`group flex flex-col items-center justify-center p-6 sm:p-8 border-2 rounded-3xl transition-all duration-300 ${
            selectedSpecies === "dog"
              ? "border-emerald-500 bg-emerald-50 text-emerald-600 scale-105 shadow-xl shadow-emerald-500/10"
              : "border-slate-200 hover:border-emerald-200 text-slate-400 hover:bg-slate-50 hover:text-emerald-500"
          }`}
        >
          <Dog className={`w-16 h-16 sm:w-20 sm:h-20 mb-4 transition-transform duration-300 ${selectedSpecies === "dog" ? "scale-110" : "group-hover:scale-110"}`} strokeWidth={1.5} />
          <span className="font-black text-xl tracking-tight">Perro</span>
        </button>

        <button
          type="button"
          onClick={() => form.setValue("species", "cat", { shouldValidate: true })}
          className={`group flex flex-col items-center justify-center p-6 sm:p-8 border-2 rounded-3xl transition-all duration-300 ${
            selectedSpecies === "cat"
              ? "border-emerald-500 bg-emerald-50 text-emerald-600 scale-105 shadow-xl shadow-emerald-500/10"
              : "border-slate-200 hover:border-emerald-200 text-slate-400 hover:bg-slate-50 hover:text-emerald-500"
          }`}
        >
          <Cat className={`w-16 h-16 sm:w-20 sm:h-20 mb-4 transition-transform duration-300 ${selectedSpecies === "cat" ? "scale-110" : "group-hover:scale-110"}`} strokeWidth={1.5} />
          <span className="font-black text-xl tracking-tight">Gato</span>
        </button>
      </div>

      {form.formState.errors.species && (
        <p className="text-red-500 text-xs font-bold text-center mt-4 bg-red-50 py-2 rounded-lg max-w-max mx-auto px-4">
          ⚠️ {form.formState.errors.species.message}
        </p>
      )}
    </div>
  );
}