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
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Cuidado Preventivo</h2>
        <p className="text-slate-500 font-medium">¿Hay alguna condición específica que te gustaría apoyar? (Opcional)</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {HEALTH_OPTIONS.map((option) => {
          const isSelected = selectedConditions.includes(option.id);
          
          return (
            <div
              key={option.id}
              onClick={() => toggleCondition(option.id)}
              className={`group cursor-pointer p-5 border-2 rounded-2xl transition-all duration-300 flex items-center gap-5 ${
                isSelected 
                  ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-500/10" 
                  : "border-slate-200 hover:border-emerald-200 hover:bg-slate-50"
              }`}
            >
              {/* Custom Checkbox visual */}
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                isSelected ? "border-emerald-500 bg-emerald-500 scale-110" : "border-slate-300 group-hover:border-emerald-300"
              }`}>
                {isSelected && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              
              <div>
                <h3 className={`font-bold text-base tracking-tight ${isSelected ? "text-emerald-900" : "text-slate-900"}`}>
                  {option.label}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{option.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <p className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-widest font-bold">
        Nota: Mascotiq es preventivo, no reemplaza consulta veterinaria.
      </p>
    </div>
  );
}