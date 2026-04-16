"use client";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";

interface DeletePetModalProps {
  petName: string;
  hasActiveSub: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeletePetModal({ petName, hasActiveSub, onConfirm, onClose }: DeletePetModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in p-4">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl mx-4 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center space-y-5">

          <div className={`p-4 rounded-2xl ${hasActiveSub ? "bg-amber-50 text-amber-500" : "bg-red-50 text-red-500"}`}>
            <AlertTriangle className="w-8 h-8" />
          </div>

          {hasActiveSub ? (
            <>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Acción bloqueada</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                <strong className="text-slate-800">{petName}</strong> tiene una suscripción activa.
                Cancela primero el plan desde <strong className="text-slate-800">Gestionar Suscripción</strong> para poder eliminar el perfil.
              </p>
              <button
                onClick={onClose}
                className="w-full py-4 mt-2 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
              >
                Entendido
              </button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Eliminar perfil</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                ¿Seguro que deseas eliminar a <strong className="text-slate-800">{petName}</strong>? Esta acción no se puede deshacer y borrará su historial.
              </p>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 bg-slate-50 border-2 border-slate-100 hover:bg-slate-100 transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95"
                >
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}