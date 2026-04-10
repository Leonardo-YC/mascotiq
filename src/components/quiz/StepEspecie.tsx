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
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">¿A quién vamos a cuidar hoy?</h2>
        <p className="text-gray-500 text-lg">Selecciona la especie de tu mascota</p>
      </div>

      {/* CAMBIO RESPONSIVE AQUÍ: grid-cols-1 en móvil, sm:grid-cols-2 en pantallas más grandes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto">
        <button
          type="button"
          onClick={() => form.setValue("species", "dog")}
          className={`flex flex-col items-center justify-center p-6 sm:p-8 border-2 rounded-2xl transition-all duration-200 shadow-sm ${
            selectedSpecies === "dog"
              ? "border-primary bg-primary/5 text-primary scale-105 shadow-md"
              : "border-gray-200 hover:border-primary/50 text-gray-500 hover:bg-slate-50"
          }`}
        >
          <Dog className="w-16 h-16 sm:w-20 sm:h-20 mb-4" strokeWidth={1.5} />
          <span className="font-bold text-xl">Perro</span>
        </button>

        <button
          type="button"
          onClick={() => form.setValue("species", "cat")}
          className={`flex flex-col items-center justify-center p-6 sm:p-8 border-2 rounded-2xl transition-all duration-200 shadow-sm ${
            selectedSpecies === "cat"
              ? "border-primary bg-primary/5 text-primary scale-105 shadow-md"
              : "border-gray-200 hover:border-primary/50 text-gray-500 hover:bg-slate-50"
          }`}
        >
          <Cat className="w-16 h-16 sm:w-20 sm:h-20 mb-4" strokeWidth={1.5} />
          <span className="font-bold text-xl">Gato</span>
        </button>
      </div>

      {form.formState.errors.species && (
        <p className="text-destructive text-sm font-medium text-center mt-4">
          {form.formState.errors.species.message}
        </p>
      )}
    </div>
  );
}