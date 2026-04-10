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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Cuéntanos sobre tu peludo</h2>
        <p className="text-gray-500 text-lg">Estos datos nos ayudarán a calcular su etapa biológica exacta.</p>
      </div>

      {/* Subida de Imagen */}
      <div className="mb-8">
        <p className="text-center font-medium text-gray-700 mb-4">Sube una foto de su carita (Opcional)</p>
        <ImageUpload value={petPhotoUrl} onChange={setPetPhotoUrl} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Nombre */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Nombre de la mascota</label>
          <input
            {...form.register("name")}
            type="text"
            placeholder="Ej: Max, Luna..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
          {form.formState.errors.name && (
            <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>
          )}
        </div>

        {/* Edad */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Edad (Años)</label>
          <input
            {...form.register("ageYears", { valueAsNumber: true })}
            type="number"
            min="0"
            step="0.5"
            placeholder="Ej: 5"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
          {form.formState.errors.ageYears && (
            <p className="text-destructive text-sm">{form.formState.errors.ageYears.message}</p>
          )}
        </div>

        {/* Peso */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Peso (Kg)</label>
          <input
            {...form.register("weightKg", { valueAsNumber: true })}
            type="number"
            min="0.1"
            step="0.1"
            placeholder="Ej: 12.5"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
          {form.formState.errors.weightKg && (
            <p className="text-destructive text-sm">{form.formState.errors.weightKg.message}</p>
          )}
        </div>

        {/* Raza / Mestizo (Solo relevante para diseño UI, aunque el motor usa el peso) */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Raza (Opcional)</label>
          <input
            {...form.register("breed")}
            type="text"
            placeholder={isDog ? "Ej: Schnauzer" : "Ej: Siamés"}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
        </div>
      </div>

      {/* Switch de Mestizo */}
      <div className="max-w-2xl mx-auto mt-4 bg-primary/5 p-4 rounded-xl border border-primary/20 flex items-start gap-3">
        <input
          {...form.register("isMixed")}
          type="checkbox"
          id="isMixed"
          className="mt-1 w-5 h-5 accent-primary rounded cursor-pointer"
        />
        <div>
          <label htmlFor="isMixed" className="font-semibold text-gray-900 cursor-pointer">Mi mascota es cruzada / híbrida</label>
          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <Info className="w-4 h-4" />
            Usaremos su peso para categorizar su tamaño biológico con precisión.
          </p>
        </div>
      </div>
    </div>
  );
}