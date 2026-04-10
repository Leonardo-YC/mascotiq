"use client";

import { UseFormReturn } from "react-hook-form";
import { QuizFormData } from "@/core/validators/quiz-schema";

interface StepSaludProps {
  form: UseFormReturn<QuizFormData>;
}

const HEALTH_OPTIONS = [
  { id: "digestion", label: "Estómago sensible / Digestión", desc: "Gases, heces blandas o vómitos ocasionales." },
  { id: "skin", label: "Piel y Pelaje", desc: "Picazón, caspa o pérdida excesiva de pelo." },
  { id: "anxiety", label: "Estrés o Ansiedad", desc: "Miedo a ruidos, ansiedad por separación." },
];

export function StepSalud({ form }: StepSaludProps) {
  // Obtenemos el array actual de condiciones seleccionadas
  const selectedConditions = form.watch("healthConditions") || [];

  const toggleCondition = (id: string) => {
    if (selectedConditions.includes(id)) {
      form.setValue("healthConditions", selectedConditions.filter(c => c !== id));
    } else {
      form.setValue("healthConditions", [...selectedConditions, id]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Cuidado Preventivo</h2>
        <p className="text-gray-500 text-lg">¿Hay alguna condición de salud que te gustaría apoyar? (Opcional)</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {HEALTH_OPTIONS.map((option) => {
          const isSelected = selectedConditions.includes(option.id);
          
          return (
            <div
              key={option.id}
              onClick={() => toggleCondition(option.id)}
              className={`cursor-pointer p-5 border-2 rounded-2xl transition-all duration-200 flex items-center gap-4 ${
                isSelected 
                  ? "border-primary bg-primary/5" 
                  : "border-gray-200 hover:border-primary/40 hover:bg-slate-50"
              }`}
            >
              {/* Custom Checkbox visual */}
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                isSelected ? "border-primary bg-primary" : "border-gray-300"
              }`}>
                {isSelected && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              
              <div>
                <h3 className={`font-bold text-lg ${isSelected ? "text-primary" : "text-gray-900"}`}>
                  {option.label}
                </h3>
                <p className="text-sm text-gray-500">{option.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <p className="text-center text-sm text-gray-400 mt-6">
        Recuerda: Mascotiq ofrece apoyo nutricional, pero no reemplaza el diagnóstico de un veterinario.
      </p>
    </div>
  );
}